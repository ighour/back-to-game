const { GAME } = require('../../game');

/** Variables */
let gamePosition, startButton, unit, tutorial, gameOver, symbol, pieces, p1, p2, turn, sequence, occupied;

/** Events */
let clickStart = () => tutorial = false;

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
        e.forEach(pp => carrier.push(pp));
        return carrier;
    }, []);
};

let getValidMove = (index, type, dir) => {
    let result = [];

    // 1 = pawn, 2 = knight, 4 = bishop, 8 = rook, 16 = queen, 32 = king
    switch(type){
        case "1": result = getPawnMove(index, dir); break;
        case "2": result = getKnightMove(index); break;
        case "4": result = getBishopMove(index); break;
        case "8": result = getRookMove(index); break;
        case "16": result = getQueenMove(index); break;
        case "32": result = getKingMove(index); break;
    }

    return result;
};

let getPawnMove = (index, dir) => {
    let result = [], target = index - 8 * dir;

    if((dir === 1 && target >= 8 || dir === -1 && target <= 48) && !occupied.includes(target))
        result.push(target);

    return result;
};

let getKnightMove = index => {
    let result = [], target = [index - 16 - 1, index - 16 + 1, index + 16 - 1, index + 16 + 1, index - 2 - 8, index - 2 + 8, index + 2 - 8, index + 2 + 8];

    target.forEach(e => {
        if(e >= 0 && e <= 63 && !occupied.includes(e))
            result.push(e);
    });

    return result;
};

let getBishopMove = index => {
    let result = [];
    let modifiers = [-8 -1, -8 + 1, 8 - 1, 8 + 1];

    modifiers.forEach(m => {
        let currentIndex = index;
        while(canExtensiveMove(currentIndex, m)){
            result.push(currentIndex + m);
            currentIndex += m;
        }
    });

    return result;
};

let getRookMove = index => {
    let result = [];
    let modifiers = [-1, + 1, -8, 8];

    modifiers.forEach(m => {
        let currentIndex = index;
        while(canExtensiveMove(currentIndex, m)){
            result.push(currentIndex + m);
            currentIndex += m;
        }
    });

    return result;
};

let getQueenMove = index => {
    let result = [];
    let modifiers = [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1];

    modifiers.forEach(m => {
        let currentIndex = index;
        while(canExtensiveMove(currentIndex, m)){
            result.push(currentIndex + m);
            currentIndex += m;
        }
    });

    return result;
};

let getKingMove = index => {
    let result = [];
    let modifiers = [-1, + 1, -8, 8, -8 - 1, - 8 + 1, 8 - 1, 8 + 1];

    modifiers.forEach(m => {
        if(canExtensiveMove(index, m))
            result.push(index + m);
    });

    return result;
};

let canExtensiveMove = (index, modifier) => {
    let result = index + modifier;
    return result >= 0 && result <= 63 && !occupied.includes(result);
};

/** Logic */
let logic = () => {
    if(tutorial || gameOver)
        return;



};

let movePieces = () => {
    if(sequence.length === 0)
        sequence = [...pieces].sort(() => Math.random() - 0.5);

    let type = turn === 2 ? sequence.shift() : sequence[0];

    switch(turn){
        case 1: //p1
            moveNPCs(type, p1, 1);
        break;
        case 2: //p2
            moveNPCs(type, p2, -1);
        break;
    };
    
    turn = turn === 1 ? 2 : 1;

    setTimeout(movePieces, 1000);
};

let moveNPCs = (type, p, dir) => {
    let group = p[type];
    let index = Math.floor(Math.random() * group.length);

    let moves = getValidMove(group[index], type, dir);

    if(moves.length > 0){
        let occupiedIndex = occupied.indexOf(group[index]);
        group[index] = moves[Math.floor(Math.random() * moves.length)];
        occupied[occupiedIndex] = group[index];
    }
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

        //Players
        drawPlayer(p1, "green");
        drawPlayer(p2, "brown");

        //Panel
        if(gameOver === true)
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} was Defeated!` : `${GAME.p.n} was Defeated!`);  
        else{
            GAME.d.dp();
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
    pieces = Object.keys(symbol);
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
    turn = 1;
    sequence = ["1", "1", "1", "1", "1", "1"];
    occupied = getOccupiedSquares();

    //Engine
    GAME.p.d = 50;
    GAME.b.n = "Evil Chess";
    GAME.b.l = 100;
    GAME.b.d = 5;

    GAME.e("click", clickStart, startButton.x, startButton.y, startButton.w, startButton.h);

    //Other
    movePieces();
};

let onUpdate = () => {
    logic();
    draw();
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export const CHESS = {os: onStart, ou: onUpdate};