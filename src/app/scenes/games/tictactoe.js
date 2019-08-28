const { GAME } = require('../../game');

/** Variables */
let gamePosition, travelButton, cellSize, tutorial, gameOver, signs, matchWinner, winCombos, board, playing, textTimer, scoreChange;

/** Events */
let clickTravel = () => {
    tutorial = false;
    GAME.ca.t("Tip: click on a square to move yourself.");
};

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
        gameOver = result === -1 ? GAME.f.db() : GAME.f.dp(undefined, scoreChange[0]);
          
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
        textTimer += GAME.dt;

        let x = GAME.c.x, y = GAME.c.y;

        GAME.d.ft("Mission #3", x + GAME.c.w / 2, y + 70, {f: 70});

        let sp = 70, tm = 50;

        let texts = [
            {c: "The year is 1952.", sp, tm},

            {c: "Evil Chess has taken control of Tic Tac Toe. Your third mission is to defeat", sp: sp / 1.8, tm},
            {c: "Tic and Tac in order to restart it.", sp, tm},

            {c: "Tic is playing against Tac. Your goal is to prevent any of them from winning", sp: sp / 1.8, tm},
            {c: "a match by weakening them.", sp, tm},

            {c: "For this you will be positioned inside the board. Each turn, you will have to", sp: sp / 1.8, tm},
            {c: "move to an adjacent board.", sp, tm},

            {c: "This will prevent Tic or Tac from marking the board where you are situated.", sp: sp / 1.8, tm},
            {c: "Be careful, as if Tic or Tac wins a match, you will be dealt damage.", sp: sp * 1.05, tm},

            {c: "Ready for this?", sp, tm, s: {ta: "c"}, x: x + GAME.c.w / 2},
        ];

        GAME.d.dtx(texts, x + 20, y + 160, {ta: "l", f: 30}, textTimer);

        if(textTimer >= 1000)
            GAME.d.db(travelButton, "Travel to 1952");
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
        let playerCoords = getPlayerCoords(playerIndex);

        for(let i = 0; i < 9; i++){
            let coords = getPlayerCoords(i);
    
            if(board[i] !== 0)
                GAME.d.ft(signs[board[i]], gamePosition.x + cellSize.w * (0.5 + coords.x), gamePosition.y + cellSize.h * (0.5 + coords.y));
            else if(playing == -1 && (playerIndex == -1 || (Math.abs(playerCoords.x - coords.x) <= 1 && Math.abs(playerCoords.y - coords.y) <= 1)))
                GAME.d.fc(gamePosition.x + (coords.x + 0.5) * cellSize.w, gamePosition.y + (coords.y + 0.5) * cellSize.h, 2, undefined, undefined, {fs: "#AAAAAA"});
        }

        //Panel
        if(gameOver === true)
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} is now rebooting...` : `${GAME.p.n} was Defeated!`);  
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
    travelButton = {
        x: x * 2.5 - 180,
        y: y * 10 - 75,
        w: 360,
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
    textTimer = 0;
    scoreChange = [
        -200
    ];

    //Engine
    GAME.p.d = 25;
    GAME.p.s[GAME.cu()] = 1000;
    GAME.b.n = "Tic & Tac";
    GAME.b.l = 100;
    GAME.b.d = 20;

    GAME.e("click", clickTravel, travelButton.x, travelButton.y, travelButton.w, travelButton.h);
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