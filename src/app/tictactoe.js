const GAME = require('./main').default;

/** Variables */
let gamePosition, startPosition, cellSize, panelPosition;
let boss, tutorial, gameOver, signs, matchWinner, winCombos, board, playing;

/** Events */
let click = (event, x, y) => {
    if(tutorial){
        //Start Button
        if(x > startPosition.x && x < startPosition.x + startPosition.width && y > startPosition.y && y < startPosition.y + startPosition.height)
            tutorial = false;
    }
    //Board
    else if(x > gamePosition.x && x < gamePosition.x + gamePosition.width && y > gamePosition.y && y < gamePosition.y + gamePosition.height) {
        if(playing !== -1 || matchWinner !== 0 || gameOver === true)
            return;

        let square = getSelectedSquare(x, y);

        if(!canMoveToSquare(square.x, square.y))
            return;

        let boardIndex = square.x + square.y*3;

        if(board[boardIndex] === 0)
            markBoard(boardIndex);
    }
};

/** Helper Functions */
let getPlayerCoords = () => {
    let index;

    for(let i = 0; i < board.length; i++){
        if(board[i] === -1){
            index = i;
            break;
        }
    };

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
        x: Math.floor((x - gamePosition.x) / cellSize.x),
        y: Math.floor((y - gamePosition.y) / cellSize.y)
    };
};

let boardIsFull = () => {
    return board.reduce((carrier, e) => carrier * e, 1) !== 0;
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
        end = GAME.functions.doDamage(boss, GAME.player.damage);
    else
        end = GAME.functions.doDamage(GAME.player, boss.damage);

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
    //Mission
    GAME.draw.fillText("Last Mission", GAME.canvas.width / 2, GAME.canvas.height / 5, {font: "100px Arial"});

    //Brief
    let texts = [
        "Year:",
        `Boss:`,
        "Intel:"
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 20, GAME.canvas.height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    texts = [
        "1950",
        boss.name
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 20 + 100, GAME.canvas.height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    texts = [
        "The boss act as player 1 (X) and 2 (0).",
        "It loses HP when game result is draw.",
        "You can move only to near positions."
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 20 + 100, GAME.canvas.height * 2 / 5 + 140, 35, {textAlign: "left", font: "30px Arial"});

    //Start
    GAME.draw.fillText("Travel", startPosition.x + startPosition.width / 2, startPosition.y + startPosition.height / 2);
    GAME.draw.strokeRect(startPosition.x, startPosition.y, startPosition.width, startPosition.height);
};

let drawBoard = () => {
    GAME.draw.line(gamePosition.x, gamePosition.y + cellSize.y, gamePosition.x + gamePosition.width, gamePosition.y + cellSize.y);
    GAME.draw.line(gamePosition.x, gamePosition.y + cellSize.y * 2, gamePosition.x + gamePosition.width, gamePosition.y + cellSize.y * 2);
    GAME.draw.line(gamePosition.x + cellSize.x, gamePosition.y, gamePosition.x + cellSize.x, gamePosition.y + gamePosition.height);
    GAME.draw.line(gamePosition.x + cellSize.x * 2, gamePosition.y, gamePosition.x + cellSize.x * 2, gamePosition.y + gamePosition.height);
};

let drawXY = () => {
    for(let i = 0; i < 9; i++)
        if(board[i] !== 0) {
            let y = Math.floor(i / 3);
            let x = i - y * 3;
            GAME.draw.fillText(signs[board[i]], gamePosition.x + cellSize.x * (0.5 + x), gamePosition.y + cellSize.y * (0.5 + y));
        }   
};

let drawGameOver = () => {
    let msg = GAME.player.life <= 0 ? `${GAME.player.name} was Defeated!` : `${boss.name} was Defeated!`;
    GAME.draw.fillText(msg, panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2);
};

let drawMatchResult = () => {
    let msg = matchWinner === -1 ? `${GAME.player.damage} damage to ${boss.name}!` : `${boss.damage} damage to you!`;
    GAME.draw.fillText(msg, panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2);
};

let drawBasePanel = () => {
    // Names
    GAME.draw.fillText(GAME.player.name, panelPosition.x + panelPosition.width / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});
    GAME.draw.fillText(boss.name, panelPosition.x + panelPosition.width * 3 / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});
    GAME.draw.fillText("x", panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});

    // Turn
    if(playing === -1)
        GAME.draw.fillText("<", panelPosition.x + panelPosition.width / 2 - 40, panelPosition.y + panelPosition.height - 17, {textBaseline: "bottom"});
    else
        GAME.draw.fillText(">", panelPosition.x + panelPosition.width / 2 + 40, panelPosition.y + panelPosition.height - 17, {textBaseline: "bottom"});

    //Lives
    let maxSize = panelPosition.x + panelPosition.width / 4;
    let playerLifeSize = GAME.player.life / 100 * maxSize;
    let bossLifeSize = boss.life / 100 * maxSize;

    GAME.draw.fillRect(panelPosition.x + panelPosition.width / 8, panelPosition.y + panelPosition.height / 2, playerLifeSize, 20);
    GAME.draw.fillRect(panelPosition.x + panelPosition.width / 8 + playerLifeSize, panelPosition.y + panelPosition.height / 2, maxSize - playerLifeSize, 20, {fillStyle: "black"});

    GAME.draw.fillRect(panelPosition.x + panelPosition.width * 7 / 8 - maxSize, panelPosition.y + panelPosition.height / 2, bossLifeSize, 20);
    GAME.draw.fillRect(panelPosition.x + panelPosition.width * 7 / 8 - maxSize + bossLifeSize, panelPosition.y + panelPosition.height / 2, maxSize - bossLifeSize, 20, {fillStyle: "black"});
};

let drawPanel = () => {
    if(gameOver === true)
        drawGameOver();
    else if(matchWinner !== 0)
        drawMatchResult();    
    else
        drawBasePanel();
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
    startPosition = {
        x: GAME.canvas.width / 2 - 90,
        y: GAME.canvas.height * 5 / 6 - 30,
        width: 180,
        height: 60
    };
    cellSize = {
        x: gamePosition.width  / 3,
        y: gamePosition.height / 3 
    };
    panelPosition = {
        x: 0,
        y: gamePosition.y + gamePosition.height + 20,
        width: GAME.canvas.width,
        height: GAME.canvas.height - (gamePosition.y + gamePosition.height + 20) - 1
    };

    //State
    boss = {
        name: "Evil Tic",
        life: 100,
        damage: 20
    };
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
    GAME.events.addClick(click);

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