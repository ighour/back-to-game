const { GAME } = require('../../game');

/** Variables */
let gamePosition, startButton, unit, tutorial, gameOver, symbol, pieces, p1, p2, player, turn, sequence, occupied, playerCanMove;

/** Events */
let clickStart = () => tutorial = false;

let clickSquare = (event, x, y) => {
    if(turn === 0 && sequence.length > 0){
        let square = {
            x: Math.floor((x - gamePosition.x) / unit.w),
            y: Math.floor((y - gamePosition.y) / unit.h)
        };
        
        let boardIndex = (square.x + square.y*8);

        if(playerCanMove.m.includes(boardIndex)){
            if(player == -1){
                player = boardIndex;
                occupied.push(player);
            }
            else {
                let occupiedIndex = occupied.indexOf(player);
                player = boardIndex;
                occupied[occupiedIndex] = player;
            }

            turn = 1;
            setTimeout(movePieces, 1000);
        }
        else if(playerCanMove.e.includes(boardIndex))
            eatPiece(player, boardIndex);
    }
};

/** Helper Functions */
let getUnitXY = index => {
    return {
        x: gamePosition.x + unit.w * (index % 8),
        y: gamePosition.y + unit.h * Math.floor(index / 8)
    };
};

let getOccupiedSquares = () => getPlayerOccupiedSquares(p1).concat(getPlayerOccupiedSquares(p2));

let getPlayerOccupiedSquares = p => {
    return Object.values(p).reduce((carrier, e) => {
        e.forEach(pp => carrier.push(parseInt(pp)));
        return carrier;
    }, []);
};

let getEmptySquares = () => {
    let result = [];
    
    for(let i = 0; i < 63; i++){
        if(!occupied.includes(i))
            result.push(i);
    }

    return result;
};

let getValidMove = (index, type, dir) => {
    // 1 = pawn, 2 = knight, 4 = bishop, 8 = rook, 16 = queen, 32 = king
    switch(type){
        case 1: 
            return {
                m: canExtensiveMoveGroup(index, dir === 0 ? [-8, 8] : [-8 * dir], false).m,
                e: canExtensiveMoveGroup(index, dir === 0 ? [-9, -7, 9, 7] : [-9 * dir, -7 * dir], false).e
            };
        case 2: return canExtensiveMoveGroup(index, [-8 - 2, -16 - 1, -8 + 2, -16 + 1, 8 - 2, 16 - 1, 8 + 2, 16 + 1], false, 2);
        case 4: return canExtensiveMoveGroup(index, [-8 -1, -8 + 1, 8 - 1, 8 + 1], true);
        case 8: return canExtensiveMoveGroup(index, [-1, + 1, -8, 8], true);
        case 16: return canExtensiveMoveGroup(index, [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1], true);
        case 32: return canExtensiveMoveGroup(index, [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1], false);
    }
};

let canExtensiveMoveGroup = (index, modifiers, multiple, jump) => {
    return modifiers.reduce((carrier, m) => {
        let currentIndex = index, can = 0;
        while(can != -1){
            can = canExtensiveMove(currentIndex, m, jump);

            if(can == -1)
                break;

            carrier[can == 0 ? "m" : "e"].push(currentIndex + m);

            if(!multiple || can == 1)
                break;

            currentIndex += m;
        }
        return carrier;
    }, {m: [], e: []});
};

let canExtensiveMove = (index, modifier, jump = 1) => {
    let indexX = index % 8;
    let indexY = Math.floor(index / 8);

    let result = index + modifier;

    if(result < 0 || result > 63)
        return -1;

    let resultX = result % 8;
    let resultY = Math.floor(result / 8);

    if(Math.abs(resultX - indexX) > jump || Math.abs(resultY - indexY) > jump)
        return -1;

    return occupied.includes(result) ? 1 : 0;
};

/** Logic */
// let logic = () => {};

let movePieces = () => {
    let type = sequence[0];

    switch(turn){
        case 1: //p1
            moveNPCs(type, p1, 1);
            turn = 2;
            setTimeout(movePieces, 1000);
        break;
        case 2: //p2
            moveNPCs(type, p2, -1);

            sequence.shift();
            sequence.push(pieces[Math.floor(Math.random() * pieces.length)]);

            playerCanMove = getValidMove(player, sequence[0], 0);

            if(playerCanMove.m.length > 0)
                turn = 0;
            else{
                turn = 1; 
                setTimeout(movePieces, 1000);
            }
        break;
    };
};

let moveNPCs = (type, p, dir) => {
    let group = p[type], index, moves;

    let indexToTest = [...group].sort(() => Math.random() - 0.5);
    while(indexToTest.length > 0){
        let value = indexToTest.shift();
        index = group.indexOf(value);
        moves = getValidMove(group[index], type, dir).m;

        if(moves.length > 0)
            break;
    }

    if(moves.length > 0){
        let occupiedIndex = occupied.indexOf(group[index]);
        group[index] = parseInt(moves[Math.floor(Math.random() * moves.length)]);
        occupied[occupiedIndex] = group[index];
    }
};

let eatPiece = (piece1, piece2) => {
    console.log("TODO");
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
        let c = Math.pow(unit.c, 2);
        for(let i = 0; i < c; i++){
            let coords = getUnitXY(i);
            GAME.d.fr(coords.x, coords.y, unit.w, unit.h, {fs: (i + Math.floor(i / 8)) % 2 === 0 ? "#DDDDDD" : "#444444"});
        }

        //Players (NPC)
        drawPlayer(p1, "green");
        drawPlayer(p2, "brown");

        //Player
        if(player != -1){
            let coords = getUnitXY(player);
            GAME.d.ft("XX", coords.x + unit.w / 2, coords.y + unit.h / 2, {f: 25, fs: "orange"});
        }

        //Available to play
        if(turn === 0){
            playerCanMove.m.forEach(e => {
                let y = Math.floor(e / 8);
                let x = e - y * 8;
                GAME.d.fc(gamePosition.x + (x + 0.5) * unit.w, gamePosition.y + (y + 0.5) * unit.h, 2, undefined, undefined, {fs: "orange"});
            });
            playerCanMove.e.forEach(e => {
                let y = Math.floor(e / 8);
                let x = e - y * 8;
                GAME.d.fc(gamePosition.x + (x + 0.5) * unit.w, gamePosition.y + (y + 0.5) * unit.h, 2, undefined, undefined, {fs: "red"});
            });
        }

        //Panel
        if(gameOver === true)
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} was Defeated!` : `${GAME.p.n} was Defeated!`);  
        else{
            GAME.d.dp();

            //Sequence      1 = pawn, 2 = knight, 4 = bishop, 8 = rook, 16 = queen, 32 = king
            GAME.d.ft("Sequence", GAME.c.p.x + GAME.c.p.w / 2, GAME.c.p.y + GAME.c.p.h / 3 - 15, {f: 20});
            if(sequence.length > 0){
                let seqNames = {1: "Pawn", 2: "Knight", 4: "Bishop", 8: "Rook", 16: "Queen", 32: "King"};
                let names = `${seqNames[sequence[0]]}`;
                for(let i = 1; i < sequence.length; i++)
                    names += ` -> ${seqNames[sequence[i]]}`;
                GAME.d.ft(names, GAME.c.p.x + GAME.c.p.w / 2, GAME.c.p.y + GAME.c.p.h / 3 + 15, {f: 30});
            }
            else
                GAME.d.ft("Sorting", GAME.c.p.x + GAME.c.p.w / 2, GAME.c.p.y + GAME.c.p.h / 3 + 15, {f: 30});

            //Turn
            let tb = "b", f = 20, x = GAME.c.p.x + GAME.c.p.w / 2, y = GAME.c.p.y + GAME.c.p.h - 20;
            GAME.d.ft("Turn", x, y, {tb, f});
            
            if(turn === 0)
                GAME.d.ft("<", x - 30, y + 2, {tb, f});
            else
                GAME.d.ft(">", x + 30, y + 2, {tb, f});

        }
    }
};

let drawPlayer = (player, fs) => {
    Object.entries(player).forEach(e => {
        let s = symbol[e[0]];

        e[1].forEach(p => {
            let coords = getUnitXY(p);
            GAME.d.ft(s, coords.x + unit.w / 2, coords.y + unit.h / 2, {f: 25, fs});
        });
    });
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

    //State
    tutorial = true;
    gameOver = false;
    symbol = {
        1: "PA",
        2: "KN",
        4: "BI",
        8: "RO",
        16: "QU",
        32: "KI",
    };
    pieces = Object.keys(symbol).map(e => parseInt(e));
    p1 = {
        1: [48, 49, 50, 51, 52, 53, 54, 55],
        2: [57, 62],
        4: [58, 61],
        8: [56, 63],
        16: [59],
        32: [60]
    };
    p2 = {
        1: [8, 9, 10, 11, 12, 13, 14, 15],
        2: [1, 6],
        4: [2, 5],
        8: [0, 7],
        16: [3],
        32: [4]
    };
    player = -1;
    turn = 0;
    sequence = [1, 1, 1, 1];
    occupied = getOccupiedSquares();
    playerCanMove = {
        m: getEmptySquares(),
        e: []
    };

    //Engine
    GAME.p.d = 50;
    GAME.b.n = "Evil Chess";
    GAME.b.l = 100;
    GAME.b.d = 5;

    GAME.e("click", clickStart, startButton.x, startButton.y, startButton.w, startButton.h);
    GAME.e("click", clickSquare, gamePosition.x, gamePosition.y, gamePosition.w, gamePosition.h);
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