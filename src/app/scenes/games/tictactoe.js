const { GAME } = require('../../game');

/** Variables */
let gamePosition, startButton, cellSize;
let tutorial, gameOver, signs, matchWinner, winCombos, board, playing;

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
        x: Math.floor((x - gamePosition.x) / cellSize.w),
        y: Math.floor((y - gamePosition.y) / cellSize.h)
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

/** Logic */
// let logic = () => {};

let endMatch = winner => {
    let end = false;

    if(winner === -1)
        end = GAME.f.db();
    else
        end = GAME.f.dp();

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

/** Draw */
let draw = () => {
    if(tutorial){
        let intel = [
            "The boss act as player 1 (X) and 2 (0).",
            "It loses HP when game result is draw.",
            "You can move only to near positions."
        ];
        GAME.d.dt("Last Mission", "1950", intel, startButton);
    }
    else{
        drawBoard();
        drawXY();
        drawPanel();
    }
};

let drawBoard = () => {
    GAME.d.l(gamePosition.x, gamePosition.y + cellSize.h, gamePosition.x + gamePosition.w, gamePosition.y + cellSize.h);
    GAME.d.l(gamePosition.x, gamePosition.y + cellSize.h * 2, gamePosition.x + gamePosition.w, gamePosition.y + cellSize.h * 2);
    GAME.d.l(gamePosition.x + cellSize.w, gamePosition.y, gamePosition.x + cellSize.w, gamePosition.y + gamePosition.h);
    GAME.d.l(gamePosition.x + cellSize.w * 2, gamePosition.y, gamePosition.x + cellSize.w * 2, gamePosition.y + gamePosition.h);
};

let drawXY = () => {
    let playerIndex = getPlayerIndex();

    for(let i = 0; i < 9; i++){
        let y = Math.floor(i / 3);
        let x = i - y * 3;

        if(board[i] !== 0)
            GAME.d.ft(signs[board[i]], gamePosition.x + cellSize.w * (0.5 + x), gamePosition.y + cellSize.h * (0.5 + y));
        else if(playing === -1 && (boardIsEmpty() || i === playerIndex - 1 || i === playerIndex + 1 || i === playerIndex + 3 || i === playerIndex - 3))
            GAME.d.fc(gamePosition.x + (x + 0.5) * cellSize.w, gamePosition.y + (y + 0.5) * cellSize.h, 2, undefined, undefined, {fs: "#AAAAAA"});
    }
};

let drawPanel = () => {
    if(gameOver === true)
        GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} was Defeated!` : `${GAME.p.n} was Defeated!`);  
    else if(matchWinner !== 0)
        GAME.d.dp(matchWinner === -1 ? `${GAME.p.d} damage to ${GAME.b.n}!` : `${GAME.b.d} damage to you!`); 
    else{
        let tb = "b";
        GAME.d.ft("x", GAME.c.p.x + GAME.c.p.w / 2, GAME.c.p.y + GAME.c.p.h - 20, {tb});
        
        if(playing === -1)
            GAME.d.ft("<", GAME.c.p.x + GAME.c.p.w / 2 - 40, GAME.c.p.y + GAME.c.p.h - 17, {tb});
        else
            GAME.d.ft(">", GAME.c.p.x + GAME.c.p.w / 2 + 40, GAME.c.p.y + GAME.c.p.h - 17, {tb});

        GAME.d.dp();
    }
};

/** Lifecycle */
let onStart = _win => {
    //UI
    gamePosition = {
        x: GAME.c.w / 5,
        y: GAME.c.h / 10,
        w: GAME.c.w * 3 / 5,
        h: GAME.c.h * 3 / 5
    };
    startButton = {
        x: GAME.c.w / 2 - 90,
        y: GAME.c.h * 9 / 10 - 30,
        w: 180,
        h: 60
    };
    cellSize = {
        w: gamePosition.w  / 3,
        h: gamePosition.h / 3 
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
    GAME.p.d = 25;
    GAME.b.n = "Evil Tic";
    GAME.b.l = 100;
    GAME.b.d = 20;

    GAME.e("click", clickStart, startButton.x, startButton.y, startButton.w, startButton.h);
    GAME.e("click", clickBoard, gamePosition.x, gamePosition.y, gamePosition.w, gamePosition.h);

    //Other
    onReset();
};

let onUpdate = () => {
    // logic();
    draw();
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

export const TICTACTOE =  {os: onStart, ou: onUpdate};