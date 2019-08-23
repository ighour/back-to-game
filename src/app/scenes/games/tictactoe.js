const GAME = require('../../game').default;

/** Variables */
let gamePosition, startButton, cellSize;
let tutorial, gameOver, signs, matchWinner, winCombos, board, playing;

/** Helper Functions */
let getPlayerIndex = () => {
    let index;

    for(let i = 0; i < board.length; i++){
        if(board[i] === -1){
            index = i;
            break;
        }
    };

    return index;
};

let getPlayerCoords = () => {
    let index = getPlayerIndex();

    let y = Math.floor(index / 3);
    let x = index - y * 3;

    return {x, y};
};

let canMoveToSquare = (x, y) => {
    let coords = getPlayerCoords();

    if(Math.abs(x - coords.x) > 1 || Math.abs(y - coords.y) > 1)
        return false;
    return true;
};

let playerCanMove = () => {
    let coords = getPlayerCoords();

    for(let i = -1; i < 2; i++)
        for(let j = -1; j < 2; j++){
            let x = coords.x + i;
            let y = coords.y + j;

            if(x >= 0 && x <= 2 && y >= 0 && y <= 2 && board[x + y*3] === 0)
                return true;
        }

    return false;
};

let getSelectedSquare = (x, y) => {
    return {
        x: Math.floor((x - gamePosition.x) / cellSize.width),
        y: Math.floor((y - gamePosition.y) / cellSize.height)
    };
};

let boardIsFull = () => {
    return board.reduce((carrier, e) => carrier * e, 1) !== 0;
};

let boardIsEmpty = () => {
    return board.reduce((carrier, e) => carrier + e, 0) === 0;
};

let checkResult = compareBoard => {
    for(let i = 0; i < winCombos.length; i++){
        let winCombo = winCombos[i];

        let result = winCombo.reduce((carrier, boardIndex) => {
            carrier *= compareBoard[boardIndex];
            return carrier;
        }, 1);

        if(result === 1)
            return 1;
        else if(result === 8)
            return 2;
    }

    return boardIsFull() ? -1 : 0;
};

let getNPCMove = () => {
    let otherPlaying = playing === 1 ? 2 : 1;

    let lose = [];
    let random = [];

    for(let i = 0; i < 9; i++){
        if(board[i] === 0){
            let nextBoard = board.slice(0);

            nextBoard[i] = playing;
            if(checkResult(nextBoard) === playing)
                return i;

            nextBoard[i] = otherPlaying;
            if(checkResult(nextBoard) === otherPlaying)
                lose.push(i);
            else
                random.push(i);
        }
    }

    if(lose.length > 0)
        return lose[0];

    return random[Math.floor(Math.random() * random.length)];
};

/** State Functions */
let endMatch = winner => {
    let end = false;

    if(winner === -1)
        end = GAME.functions.doDamageBoss();
    else
        end = GAME.functions.doDamagePlayer();

    if(end)
        gameOver = true;
    else{
        matchWinner = winner;
        setTimeout(onReset, 2000);
    }
};

let makeNPCMove = () => {
    let boardIndex = getNPCMove();

    setTimeout(() => markBoard(boardIndex), 500);
};

let clearPlayerBoard = () => {
    for(let i = 0; i < board.length; i++)
        if(board[i] === -1)
            board[i] = 0;
};

let markBoard = boardIndex => {
    if(playing === -1)
        clearPlayerBoard();

    board[boardIndex] = playing;

    switch(playing){
        case -1: playing = 1; break;
        case 1: playing = 2; break;
        case 2:
            if(playerCanMove())
                playing = -1;
            else
                playing = 1;    
        break;
    }

    let result = checkResult(board);

    if(result !== 0)
        endMatch(result);
    
    else if(playing > 0)
        setTimeout(() => makeNPCMove(), Math.random() * 501 + 500);
};

/** Draw Functions */
let drawTutorial = () => {
    let intel = [
        "The boss act as player 1 (X) and 2 (0).",
        "It loses HP when game result is draw.",
        "You can move only to near positions."
    ];

    GAME.draw.drawTutorial("Last Mission", "1950", intel, startButton);
};

let drawBoard = () => {
    GAME.draw.line(gamePosition.x, gamePosition.y + cellSize.height, gamePosition.x + gamePosition.width, gamePosition.y + cellSize.height);
    GAME.draw.line(gamePosition.x, gamePosition.y + cellSize.height * 2, gamePosition.x + gamePosition.width, gamePosition.y + cellSize.height * 2);
    GAME.draw.line(gamePosition.x + cellSize.width, gamePosition.y, gamePosition.x + cellSize.width, gamePosition.y + gamePosition.height);
    GAME.draw.line(gamePosition.x + cellSize.width * 2, gamePosition.y, gamePosition.x + cellSize.width * 2, gamePosition.y + gamePosition.height);
};

let drawXY = () => {
    let playerIndex = getPlayerIndex();

    for(let i = 0; i < 9; i++){
        let y = Math.floor(i / 3);
        let x = i - y * 3;

        if(board[i] !== 0)
            GAME.draw.fillText(signs[board[i]], gamePosition.x + cellSize.width * (0.5 + x), gamePosition.y + cellSize.height * (0.5 + y));
        else if(playing === -1 && (boardIsEmpty() || i === playerIndex - 1 || i === playerIndex + 1 || i === playerIndex + 3 || i === playerIndex - 3))
            GAME.draw.fillCircle(gamePosition.x + (x + 0.5) * cellSize.width, gamePosition.y + (y + 0.5) * cellSize.height, 2, undefined, undefined, {fillStyle: "#AAAAAA"});
    }
};

let drawMatchResult = () => {
    let msg = matchWinner === -1 ? `${GAME.player.damage} damage to ${GAME.boss.name}!` : `${GAME.boss.damage} damage to you!`;
    GAME.draw.fillText(msg, GAME.canvas.panelPosition.x + GAME.canvas.panelPosition.width / 2, GAME.canvas.panelPosition.y + GAME.canvas.panelPosition.height / 2);
};


let drawPanel = () => {
    if(gameOver === true)
        GAME.draw.drawGameOver();
    else if(matchWinner !== 0)
        drawMatchResult();    
    else{
        // Turn
        GAME.draw.fillText("x", GAME.canvas.panelPosition.x + GAME.canvas.panelPosition.width / 2, GAME.canvas.panelPosition.y + GAME.canvas.panelPosition.height - 20, {textBaseline: "bottom"});
        
        if(playing === -1)
            GAME.draw.fillText("<", GAME.canvas.panelPosition.x + GAME.canvas.panelPosition.width / 2 - 40, GAME.canvas.panelPosition.y + GAME.canvas.panelPosition.height - 17, {textBaseline: "bottom"});
        else
            GAME.draw.fillText(">", GAME.canvas.panelPosition.x + GAME.canvas.panelPosition.width / 2 + 40, GAME.canvas.panelPosition.y + GAME.canvas.panelPosition.height - 17, {textBaseline: "bottom"});

        //Players
        GAME.draw.drawPanel();
    }
};

/** Events */
let clickStart = () => {tutorial = false};

let clickBoard = (event, x, y) => {
    if(!tutorial && playing === -1 && matchWinner === 0 && !gameOver) {
        let square = getSelectedSquare(x, y);

        if(!canMoveToSquare(square.x, square.y))
            return;

        let boardIndex = square.x + square.y*3;

        if(board[boardIndex] === 0)
            markBoard(boardIndex);
    }
};

/** Lifecycle */
let onStart = _win => {
    //UI
    gamePosition = {
        x: GAME.canvas.width / 5,
        y: GAME.canvas.height / 10,
        width: GAME.canvas.width * 3 / 5,
        height: GAME.canvas.height * 3 / 5
    };
    startButton = {
        x: GAME.canvas.width / 2 - 90,
        y: GAME.canvas.height * 9 / 10 - 30,
        width: 180,
        height: 60
    };
    cellSize = {
        width: gamePosition.width  / 3,
        height: gamePosition.height / 3 
    };

    //State
    tutorial = true;
    gameOver = false;
    signs = {
        "-1": "P",
        0: "",
        1: "X",
        2: "0"
    };
    winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    //Engine
    GAME.player.damage = 25;
    GAME.boss.name = "Evil Tic";
    GAME.boss.life = 100;
    GAME.boss.damage = 20;

    GAME.addEvent("click", clickStart, startButton.x, startButton.y, startButton.width, startButton.height);
    GAME.addEvent("click", clickBoard, gamePosition.x, gamePosition.y, gamePosition.width, gamePosition.height);

    //Other
    onReset();
};

let onUpdate = () => {
    if(tutorial){
        drawTutorial();
    }
    else{
        //Game
        drawBoard();
        drawXY();

        //Panel
        drawPanel();
    }
};

let onReset = () => {
    board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0  
    ];
    matchWinner = 0;
    playing = -1;
};

// let onStop = () => {

// };

export default {onStart, onUpdate};