const { GAME } = require('../../game');

/** Variables */
let gamePosition, startButton, cellSize, tutorial, gameOver, signs, matchWinner, winCombos, board, playing;

/** Events */
let clickStart = () => tutorial = false;

let clickBoard = (event, x, y) => {
    if(!tutorial && playing === -1 && matchWinner === 0 && !gameOver) {
        let square = {
            x: Math.floor((x - gamePosition.x) / cellSize.w),
            y: Math.floor((y - gamePosition.y) / cellSize.h)
        };
        let playerIndex = getPlayerIndex();
        let coords = getPlayerCoords(playerIndex);

        if(playerIndex === -1 || Math.abs(square.x - coords.x) <= 1 && Math.abs(square.y - coords.y) <= 1){
            let boardIndex = square.x + square.y*3;

            if(board[boardIndex] === 0)
                markBoard(boardIndex);
        }
    }
};

/** Helper Functions */
let getPlayerIndex = () => {
    for(let i = 0; i < board.length; i++){
        if(board[i] === -1)
            return i;
    };
    return -1;
};

let getPlayerCoords = (index = getPlayerIndex()) => {
    let y = Math.floor(index / 3);

    return {
        x: index - y * 3, 
        y
    };
};

let checkResult = compareBoard => {
    for(let i = 0; i < winCombos.length; i++){
        let result = winCombos[i].reduce((carrier, boardIndex) => {
            carrier *= compareBoard[boardIndex];
            return carrier;
        }, 1);

        if(result === 1 || result === 8)
            return Math.cbrt(result);
    }

    return board.reduce((carrier, e) => carrier * e, 1) !== 0 ? -1 : 0;
};

/** Logic */
// let logic = () => {};

let makeNPCMove = () => {
    let boardIndex = -1, lose = [], random = [];
    let otherPlaying = playing === 1 ? 2 : 1;

    for(let i = 0; i < 9; i++){
        if(board[i] === 0){
            let nextBoard = board.slice(0);

            nextBoard[i] = playing;
            if(checkResult(nextBoard) === playing){
                boardIndex = i;
                break;
            }

            nextBoard[i] = otherPlaying;
            if(checkResult(nextBoard) === otherPlaying)
                lose.push(i);
            else
                random.push(i);
        }
    }

    if(boardIndex === -1)
        boardIndex = lose.length > 0 ? lose[0] : random[Math.floor(Math.random() * random.length)];

    setTimeout(() => markBoard(boardIndex), 500);
};

let markBoard = boardIndex => {
    if(playing === -1){
        for(let i = 0; i < board.length; i++)
            if(board[i] === -1)
                board[i] = 0;
    }

    board[boardIndex] = playing;

    switch(playing){
        case -1: playing = 1; break;
        case 1: playing = 2; break;
        case 2:
            let coords = getPlayerCoords();
            let canPlay = false;

            for(let i = -1; i < 2; i++)
                for(let j = -1; j < 2; j++){
                    let x = coords.x + i;
                    let y = coords.y + j;
        
                    if(x >= 0 && x <= 2 && y >= 0 && y <= 2 && board[x + y*3] === 0){
                        canPlay = true;
                        break;
                    }
                }
        
            playing = canPlay ? -1 : 1;   
        break;
    }

    let result = checkResult(board);

    if(result !== 0){
        gameOver = result === -1 ? GAME.f.db() : GAME.f.dp();
          
        if(!gameOver){
            matchWinner = result;
            setTimeout(onReset, 2000);
        }
    }
    
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
        GAME.d.dt("Mission #3", "1952", intel, startButton);
    }
    else{
        //Board
        for(let i = 0; i < 2; i++)
            for(let j = 0; j < 2; j++)
                GAME.d.l(gamePosition.x + cellSize.w * i * (j+1),
                        gamePosition.y + cellSize.h * (1-i) * (j+1),
                        gamePosition.x + gamePosition.w * (1-i) + cellSize.w * i * (j+1),
                        gamePosition.y + cellSize.h * (1-i) * (j+1) + gamePosition.h * i);

        //Players
        let playerIndex = getPlayerIndex();

        for(let i = 0; i < 9; i++){
            let y = Math.floor(i / 3);
            let x = i - y * 3;
    
            if(board[i] !== 0)
                GAME.d.ft(signs[board[i]], gamePosition.x + cellSize.w * (0.5 + x), gamePosition.y + cellSize.h * (0.5 + y));
            else if(playing === -1 && (playerIndex === -1 || i === playerIndex - 1 || i === playerIndex + 1 || i === playerIndex + 3 || i === playerIndex - 3))
                GAME.d.fc(gamePosition.x + (x + 0.5) * cellSize.w, gamePosition.y + (y + 0.5) * cellSize.h, 2, undefined, undefined, {fs: "#AAAAAA"});
        }

        //Panel
        if(gameOver === true)
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} was Defeated!` : `${GAME.p.n} was Defeated!`);  
        else if(matchWinner !== 0)
            GAME.d.dp(matchWinner === -1 ? `${GAME.p.d} damage to ${GAME.b.n}!` : `${GAME.b.d} damage to you!`); 
        else{
            let tb = "b", x = GAME.c.p.x + GAME.c.p.w / 2, y = GAME.c.p.y + GAME.c.p.h - 17;
            GAME.d.ft("x", x, y - 20, {tb});
            
            if(playing === -1)
                GAME.d.ft("<", x - 40, y, {tb});
            else
                GAME.d.ft(">", x + 40, y, {tb});

            GAME.d.dp();
        }
    }
};

/** Lifecycle */
let onStart = () => {
    let x = GAME.c.w / 5, y = GAME.c.h / 10;

    //UI
    gamePosition = {
        x,
        y,
        w: x * 3,
        h: y * 6
    };
    startButton = {
        x: x * 2.5 - 105,
        y: y * 8.5,
        w: 210,
        h: 60
    };
    cellSize = {
        w: gamePosition.w / 3,
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