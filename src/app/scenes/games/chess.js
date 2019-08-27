const { GAME } = require('../../game');

/** Variables */
let gamePosition, startButton, unit, hovering, tutorial, gameOver, colors, symbol, pieces, turn, sequence, board, player0, player1, player2, playerCanMove, playerCanAttack;

/** Events */
let clickStart = () => tutorial = false;

let clickSquare = (event, x, y) => {
    if(turn == 0){
        let square = {
            x: Math.floor((x - gamePosition.x) / unit.w),
            y: Math.floor((y - gamePosition.y) / unit.h)
        };
        
        let boardIndex = (square.x + square.y*8);

        if(playerCanMove.includes(boardIndex)){
            if(player0.length == 0)
                insertPiece(player0, boardIndex, sequence[0]);
            else
                movePiece(player0, player0[0], boardIndex);

            turn = 1;
            setTimeout(() => playNPC(player1), 1000);
        }

        else if(playerCanAttack.includes(boardIndex)){
            attackPiece(player0, player0[0], boardIndex);
            turn = 1;
            setTimeout(() => playNPC(player1), 1000);
        }
    }
};

let moveSquare = (event, x, y) => {
    if(turn == 0){
        let square = {
            x: Math.floor((x - gamePosition.x) / unit.w),
            y: Math.floor((y - gamePosition.y) / unit.h)
        };
        
        hovering = (square.x + square.y*8);
    }
};

/** Helper Functions */
let getUnitXY = index => {
    return {
        x: gamePosition.x + unit.w * (index % 8),
        y: gamePosition.y + unit.h * Math.floor(index / 8)
    };
};

/** Logic */
// let logic = () => {};

let insertPiece = (player, boardIndex, boardValue) => {
    player.push(boardIndex);
    board[boardIndex] = boardValue;
};

let movePiece = (player, fromBoardIndex, toBoardIndex) => {
    player[player.indexOf(fromBoardIndex)] = toBoardIndex;
    board[toBoardIndex] = board[fromBoardIndex];
    board[fromBoardIndex] = 0;
};

let removePiece = (player, fromBoardIndex) => {
    player.splice(player.indexOf(fromBoardIndex), 1);
    board[fromBoardIndex] = 0;
};

let attackPiece = (player, attackerBoardIndex, defenderBoardIndex) => {
    if(player === player0){
        gameOver = GAME.f.db(board[defenderBoardIndex] == 6 ? 50 : undefined);
        removePiece(player1.includes(defenderBoardIndex) ? player1 : player2, defenderBoardIndex);
        movePiece(player, attackerBoardIndex, defenderBoardIndex);
    }

    else{
        gameOver = GAME.f.dp();
        removePiece(player, attackerBoardIndex);
    }
};

let evolvePiece = targetBoardIndex => {
    board[targetBoardIndex] = pieces[Math.floor(Math.random() * (pieces.length - 2)) + 1]
};

let playNPC = (player) => {
    if(gameOver)
        return;

    let availableBoardIndex = [];

    for(let i = 0; i < board.length; i++){
        let boardValue = board[i];

        if(boardValue == sequence[0] && player.includes(i))
            availableBoardIndex.push(i);
    }

    if(availableBoardIndex.length > 0){
        let sortedAvailableBoardIndex = [...availableBoardIndex].sort(() => Math.random() - 0.5);
        let boardDirection = player === player1 ? -1 : 1;
        let currentBoardIndex, pieceCanAttack = [], pieceCanMove = [], moveBoardIndex;

        while(sortedAvailableBoardIndex.length > 0){
            currentBoardIndex = sortedAvailableBoardIndex.shift();

            let tempPieceCanAttack = getPieceCanAttack(player, currentBoardIndex, boardDirection);

            if(tempPieceCanAttack.length > 0){
                pieceCanAttack = tempPieceCanAttack;
                break;
            }

            let tempPieceCanMove = getPieceCanMove(currentBoardIndex, boardDirection); 

            if(tempPieceCanMove.length > 0){
                pieceCanMove = tempPieceCanMove;
                moveBoardIndex = currentBoardIndex;
            }
        }

        if(pieceCanAttack.length > 0)
            attackPiece(player, currentBoardIndex, pieceCanAttack[Math.floor(Math.random() * pieceCanAttack.length)]);

        else if(pieceCanMove.length > 0){
            let targetBoardIndex = pieceCanMove[Math.floor(Math.random() * pieceCanMove.length)];
            movePiece(player, moveBoardIndex, targetBoardIndex);

            if(board[targetBoardIndex] == 1 && (player === player2 && targetBoardIndex < 8 || player === player1 && targetBoardIndex >= 56))
                evolvePiece(targetBoardIndex);
        }
    }

    turn = (turn + 1) % 3;

    if(player === player1)
        setTimeout(() => playNPC(player2), 1000);

    else if(player === player2){
        sequence.push(pieces[Math.floor(Math.random() * pieces.length)]);
        sequence.shift();
        board[player0[0]] = sequence[0];

        playerCanAttack = getPieceCanAttack(player0, player0[0], 0);
        playerCanMove = getPieceCanMove(player0[0], 0);

        if(playerCanAttack.length == 0 && playerCanMove.length == 0){
            turn = 1;
            setTimeout(() => playNPC(player1), 1000);
        }
    }
};

let getPieceCanAttack = (player, boardIndex, direction) => {
    let modifiers = [], jump = 1, multiple = false;

    switch(sequence[0]){
        case 1: modifiers = direction === 0 ? [-9, -7, 9, 7] : [-9 * direction, -7 * direction]; break;
        case 2: modifiers = [-8 - 2, -16 - 1, -8 + 2, -16 + 1, 8 - 2, 16 - 1, 8 + 2, 16 + 1]; jump = 2; break;
        case 3: modifiers = [-8 -1, -8 + 1, 8 - 1, 8 + 1]; multiple = true; break;
        case 4: modifiers = [-1, + 1, -8, 8]; multiple = true; break;
        case 5: modifiers = [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1]; multiple = true; break;
        case 6: modifiers = [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1]; break;
    }

    return modifiers.reduce((carrier, m) => {
        let currentBoardIndex = boardIndex, can = true;

        while(can){
            can = checkBoardRules(currentBoardIndex, m, jump);

            if(!can)
                break;

            let targetBoardIndex = currentBoardIndex + m;

            if(board[targetBoardIndex] != 0){
                if(board[targetBoardIndex] == sequence[0] && (player === player0 || (player0.includes(targetBoardIndex) && sequence[0] != 6)))
                    carrier.push(targetBoardIndex);
                break;
            }
            
            if(!multiple)
                break;

            currentBoardIndex += m;
        }

        return carrier;
    }, []);
};

let getPieceCanMove = (boardIndex, direction) => {
    let modifiers = [], jump = 1, multiple = false;

    switch(sequence[0]){
        case 1: modifiers = direction === 0 ? [-8, 8] : [-8 * direction]; break;
        case 2: modifiers = [-8 - 2, -16 - 1, -8 + 2, -16 + 1, 8 - 2, 16 - 1, 8 + 2, 16 + 1]; jump = 2; break;
        case 3: modifiers = [-8 -1, -8 + 1, 8 - 1, 8 + 1]; multiple = true; break;
        case 4: modifiers = [-1, + 1, -8, 8]; multiple = true; break;
        case 5: modifiers = [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1]; multiple = true; break;
        case 6: modifiers = [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1]; break;
    }

    return modifiers.reduce((carrier, m) => {
        let currentBoardIndex = boardIndex, can = true;

        while(can){
            can = checkBoardRules(currentBoardIndex, m, jump);

            if(!can)
                break;

            let targetBoardIndex = currentBoardIndex + m;

            if(board[targetBoardIndex] != 0)
                break;

            carrier.push(targetBoardIndex);
            
            if(!multiple)
                break;

            currentBoardIndex += m;
        }

        return carrier;
    }, []);
};

let checkBoardRules = (boardIndex, modifier, jump) => {
    let indexX = boardIndex % 8;
    let indexY = Math.floor(boardIndex / 8);

    let result = boardIndex + modifier;

    if(result < 0 || result > 63)
        return false;

    let resultX = result % 8;
    let resultY = Math.floor(result / 8);

    if(Math.abs(resultX - indexX) > jump || Math.abs(resultY - indexY) > jump)
        return false;

    return true;
};

/** Draw */
let draw = () => {
    if(tutorial){
        let intel = [
            " ",
            " ",
            " "
        ];
        GAME.d.dt("Final Mission", "1950", intel, startButton);
    }
    else {
        //Board
        for(let i = 0; i < board.length; i++){
            let coords = getUnitXY(i);
            GAME.d.fr(coords.x, coords.y, unit.w, unit.h, {fs: (i + Math.floor(i / 8)) % 2 === 0 ? colors[0] : colors[1]});
        }

        //Players
        drawPlayer(player0, colors[2]);
        drawPlayer(player1, colors[3]);
        drawPlayer(player2, colors[4]);

        //Available to play
        if(turn == 0){
            drawAvailable(playerCanMove, colors[2]);
            drawAvailable(playerCanAttack, colors[5]);
        }

        //Panel
        if(gameOver === true)
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} was Defeated!` : `${GAME.p.n} was Defeated!`);  
        else{
            GAME.d.dp();

            //Sequence
            GAME.d.dic(symbol[sequence[0]], GAME.c.p.x + GAME.c.p.w / 2 - 70, GAME.c.p.y + GAME.c.p.h / 3 - 5, "white", "#333333", 25);
            GAME.d.ft("->", GAME.c.p.x + GAME.c.p.w / 2 - 35, GAME.c.p.y + GAME.c.p.h / 3 - 5, {f: 20});
            GAME.d.dic(symbol[sequence[1]], GAME.c.p.x + GAME.c.p.w / 2, GAME.c.p.y + GAME.c.p.h / 3 - 5, "#AAAAAA", "#333333", 25);
            GAME.d.ft("->", GAME.c.p.x + GAME.c.p.w / 2 + 35, GAME.c.p.y + GAME.c.p.h / 3 - 5, {f: 20});
            GAME.d.dic(symbol[sequence[2]], GAME.c.p.x + GAME.c.p.w / 2 + 70, GAME.c.p.y + GAME.c.p.h / 3 - 5, "#AAAAAA", "#333333", 25);
            GAME.d.ft("Order", GAME.c.p.x + GAME.c.p.w / 2, GAME.c.p.y + GAME.c.p.h / 3 + 35, {f: 20});
        }
    }
};

let drawPlayer = (player, fs) => {
    for(let i = 0; i < player.length; i++){
        let boardIndex = player[i];
        let coords = getUnitXY(boardIndex);

        GAME.d.dic(symbol[board[boardIndex]], coords.x + unit.w / 2, coords.y + unit.h / 2, fs, (boardIndex + Math.floor(boardIndex / 8)) % 2 === 0 ? colors[0] : colors[1], 30);
    }
};

let drawAvailable = (list, fs) => {
    for(let i = 0; i < list.length; i++){
        let boardIndex = list[i];
        let coords = getUnitXY(boardIndex);

        if(boardIndex == hovering)
            GAME.d.fr(coords.x, coords.y, unit.w, unit.h, {fs});

        else
            GAME.d.sr(coords.x, coords.y, unit.w, unit.h, {ss: fs});
    }
};

/** Lifecycle */
let onStart = () => {
    let x = GAME.c.w / 2, y = GAME.c.h / 2;

    //UI
    gamePosition = {
        x: x / 4,
        y: y / 10,
        w: x * 1.5,
        h: y * 1.5
    };
    startButton = {
        x: x - 105,
        y: y * 1.7,
        w: 210,
        h: 60
    };
    unit = {
        w: gamePosition.w / 8,
        h: gamePosition.h / 8,
        c: 8
    };
    hovering = -1;

    //State
    tutorial = true;
    gameOver = false;
    colors = [
        "#D8DbBf",  //board 1
        "#7d8796",   //board 2
        "#224422",    //player0
        "maroon",    //player1
        "indigo",    //player2
        "rgba(255, 0, 0, 0.3)", //attack available
    ]
    symbol = {
        1: "PA",
        2: "KN",
        3: "BI",
        4: "RO",
        5: "QU",
        6: "KI",
    };
    pieces = Object.keys(symbol).map(e => parseInt(e));
    turn = 0;
    sequence = [1, 1, 1, 1];
    board = [   // 0 = empty, 1 = pawn, 2 = knight, 3 = bishop, 4 = rook, 5 = queen, 6 = king
        4, 2, 3, 5, 6, 3, 2, 4,
        1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1,
        4, 2, 3, 5, 6, 3, 2, 4,
    ];
    player0 = [];   //player
    player1 = [   //boss
        0, 1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11, 12, 13, 14, 15
    ];
    player2 = [   //boss
        48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63
    ];
    playerCanMove = [
        24, 25, 26, 27, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38, 39
    ];
    playerCanAttack = [];

    //Engine
    GAME.p.d = 100 / 31.9;
    GAME.b.n = "Evil Chess";
    GAME.b.l = 100;
    GAME.b.d = 200 / 31.9;

    GAME.e("click", clickStart, startButton.x, startButton.y, startButton.w, startButton.h);
    GAME.e("click", clickSquare, gamePosition.x, gamePosition.y, gamePosition.w, gamePosition.h);
    GAME.e("mousemove", moveSquare, gamePosition.x, gamePosition.y, gamePosition.w, gamePosition.h);
};

let onUpdate = () => {
    // logic();
    draw();
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export const CHESS = {os: onStart, ou: onUpdate};