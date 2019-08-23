const { GAME } = require('../../game');

/** Variables */
let gamePosition, startButton, unit, map, bossAnimation, playerAnimation;
let tutorial, gameOver, mapPlayers, mapBoss, lastMapBoss, mapFoods, time, moving, graph;

/** Events */
let clickStart = () => tutorial = false;

let mouseMove = (event, x, y) => {
    if(!tutorial)
        moving = GAME.f.norm(x - (gamePosition.x + gamePosition.w / 2), y - (gamePosition.y + gamePosition.h / 2));
};

/** Helper Functions */
let getUnitXY = index => {
    return {
        x: gamePosition.x + unit.w * (index % unit.c),
        y: gamePosition.y + unit.h * Math.floor(index / unit.c)
    };
};

let getNearIndex = (dir, index) => {
    switch(dir){
        case "l": return index % unit.c === 0 ? index + unit.c - 1 : index - 1;
        case "r": return index % unit.c === unit.c - 1 ? index - unit.c + 1 : index + 1;
        case "t": return Math.floor(index / unit.c) === 0 ? index + unit.c * (unit.c - 1) : index - unit.c;
        case "b": return Math.floor(index / unit.c) === unit.c - 1 ? index - unit.c * (unit.c - 1) : index + unit.c;
    };
};

let getNearValidIndex = (dir, index) => {
    let near = getNearIndex(dir, index);
    return map[near] === 0 ? near : -1;
};

let canMoveSide = (side, index) => {
    let nearIndex = getNearIndex(side, index);
    return map[nearIndex] === 1 ? -1 : nearIndex;
};

let canMove = index => {
    return {
        l: canMoveSide("l", index),
        r: canMoveSide("r", index),
        t: canMoveSide("t", index),
        b: canMoveSide("b", index),
    };
};

let playerChooseMove = (coord, prev, next) => {
    if(coord <= 0 && prev !== -1)
        return prev;
    else if(coord > 0 && next !== -1)
        return next;
    return -1;
};

/** Logic */
let logic = () => {
    if(tutorial || gameOver)
        return;

    time += GAME.dt;

    if(time >= 250){
        bossAnimation.b = 0;
        playerAnimation.c = 1;
    }
    else if(time >= 200){
        bossAnimation.b = 2;
        playerAnimation.c = 0;
    }
    else if(time >= 150){
        bossAnimation.b = 1;
        playerAnimation.c = 1;
    }
    else if(time >= 100){
        bossAnimation.b = 0;
        playerAnimation.c = 0;
    }
    else if(time >= 50){
        bossAnimation.b = 2;
        playerAnimation.c = 1;
    }
    else if(time >= 0){
        bossAnimation.b = 1;
        playerAnimation.c = 0;
    }
 
    if(time >= 300){  //300ms
        bossMove();
        playersMove();
        checkCollisions();

        time = 0;
    }
};

let bossMove = () => {
    if(!gameOver && mapFoods.length > 0 && GAME.b.p.length === 0)
        bossThink();

    //Pursuit
    if(GAME.b.p.length > 0){
        let target = GAME.b.p.shift();

        lastMapBoss = mapBoss;
        mapBoss = target;

        //Animation
        if(mapBoss === getNearIndex("l", lastMapBoss))
            bossAnimation.d = "l";
        else if(mapBoss === getNearIndex("r", lastMapBoss))
            bossAnimation.d = "r";
        else if(mapBoss === getNearIndex("t", lastMapBoss))
            bossAnimation.d = "t";
        else if(mapBoss === getNearIndex("b", lastMapBoss))
            bossAnimation.d = "b";
    }
};

let bossThink = () => {
    let target = graph.BFS(mapBoss, index => mapFoods.includes(index)).pop();

    if(target !== undefined)
        GAME.b.p = graph.shortestPath(mapBoss, target);
};

let playersMove = () => {
    let preferHorizontal = Math.abs(moving.x) >= Math.abs(moving.y);

    mapPlayers = mapPlayers.map(e => {
        let can = canMove(e);
        let newIndex = -1;

        if(preferHorizontal){
            newIndex = playerChooseMove(moving.x, can.l, can.r);

            if(newIndex === -1 && Math.abs(moving.y) >= 0.2)
                newIndex = playerChooseMove(moving.y, can.t, can.b);
        }
        else {
            newIndex = playerChooseMove(moving.y, can.t, can.b);

            if(newIndex === -1 && Math.abs(moving.x) >= 0.2)
                newIndex = playerChooseMove(moving.x, can.l, can.r);
        }
        return newIndex === -1 ? e : newIndex;
    })
    .filter(e => {
        //Avoid swiping with boss
        if(e === lastMapBoss){
            if(!gameOver)
                gameOver = mapPlayers.length === 1 ? GAME.f.db() : GAME.f.dp(GAME.b.d2);
            return false;
        }
        return true;
    });
};

let checkCollisions = () => {
    //Join players
    mapPlayers = mapPlayers.filter((e, i) => mapPlayers.indexOf(e) === i);

    //Eat player?
    if(mapPlayers.length === 1 && mapPlayers[0] === mapBoss)
        gameOver = GAME.f.db();
    else
        mapPlayers = mapPlayers.filter(e => {
            if(e === mapBoss){
                if(!gameOver)
                    gameOver = GAME.f.dp(GAME.b.d2);
                return false;
            }
    
            return true;
        });

    //Eat food?
    mapFoods = mapFoods.filter(e => {
        if(e === mapBoss){
            if(!gameOver)
                gameOver = GAME.f.dp();
            return false;
        }

        return true;
    });
};

let generateGraph = () => {
    graph = new GAME.ds.g();

    for(let i = 0; i < map.length; i++){
        if(map[i] === 0){   //movable
            graph.addVertex(i);

            ["l", "r", "t", "b"].forEach(e => {
                let neighbor = getNearValidIndex(e, i);
                if(neighbor !== -1)
                    graph.addEdge(i, neighbor);
            });
        }
    }
};

/** Draw */
let draw = () => {
    if(tutorial){
        let intel = [
            "Boss is eating your life and you can do nothing",
            "Except if you join all ghosts together and eat him",
            "But they are confused with your orders"
        ];
        GAME.d.dt("Mission #1", "1980", intel, startButton);
    }
    else {
        drawMap();
        drawTargets();
        drawPanel();
    }
};

let drawMap = () => {
    for(let i = 0; i < map.length; i++){
        let coords = getUnitXY(i);

        if(map[i] === 1){
            GAME.d.fr(coords.x, coords.y, unit.w, unit.h);
            GAME.d.sr(coords.x, coords.y, unit.w, unit.h, {ss: "#EEEEEE"});
        }
        else
            GAME.d.fr(coords.x, coords.y, unit.w, unit.h, {fs: "#666666"});
    }
};

let drawTargets = () => {
    let radius = unit.w >= unit.h ? unit.h / 2 : unit.w / 2;

    //Foods
    mapFoods.forEach(e => {
        let coords = getUnitXY(e);
        GAME.d.fc(coords.x + unit.w / 2, coords.y + unit.h / 2, radius / 8);
    });

    //Players
    mapPlayers.forEach(e => {
        let coords = getUnitXY(e);
        let playerX = coords.x + unit.w / 2, playerY = coords.y + unit.h / 2;

        let bgColor = mapPlayers.length === 1 ? "orange" : playerAnimation.t[playerAnimation.c][0];
        let color = mapPlayers.length === 1 ? "royalblue" : playerAnimation.t[playerAnimation.c][1];

        GAME.d.fc(playerX, playerY, radius, undefined, undefined, {fs: bgColor});
        GAME.d.fr(playerX - radius, playerY, radius * 2, radius * 9 / 10, {fs: bgColor});

        if(mapPlayers.length !== 1){
            let mouthY = playerY + radius / 4;
            let mouth = [
                [playerX, mouthY, playerX - radius / 4, mouthY + radius / 5],
                [playerX - radius / 4, mouthY + radius / 5, playerX - radius * 2 / 4, mouthY],
                [playerX - radius * 2 / 4, mouthY, playerX - radius * 3 / 4, mouthY + radius / 5],
    
                [playerX, mouthY, playerX + radius / 4, mouthY + radius / 5],
                [playerX + radius / 4, mouthY + radius / 5, playerX + radius * 2 / 4, mouthY],
                [playerX + radius * 2 / 4, mouthY, playerX + radius * 3 / 4, mouthY + radius / 5],
            ];
    
            mouth.forEach(m => {
                GAME.d.l(m[0], m[1], m[2], m[3], {ss: color});
            });
        }

        GAME.d.fc(playerX - radius / 3, playerY - radius / 2, radius / 8, undefined, undefined, {fs: color});
        GAME.d.fc(playerX + radius / 3, playerY - radius / 2, radius / 8, undefined, undefined, {fs: color});
    });

    //Boss
    if(GAME.b.l > 0){
        let bossCoords = getUnitXY(mapBoss);
        let bossX = bossCoords.x + unit.w / 2, bossY = bossCoords.y + unit.h / 2;
        let bossStartAngle = Math.PI, bossStartAngle2 = Math.PI, bossEyeX, bossEyeY, biteAngle = Math.PI / 8 * bossAnimation.b;
        switch(bossAnimation.d){
            case "l": bossStartAngle *= 1.25; bossStartAngle2 *= 1.75; bossEyeX = bossX + unit.w / 20; bossEyeY = bossY - unit.h / 5; break;
            case "r": bossStartAngle *= 0.25; bossStartAngle2 *= 0.75; bossEyeX = bossX - unit.w / 20; bossEyeY = bossY - unit.h / 5;  break;
            case "t": bossStartAngle *= 1.75; bossStartAngle2 *= 0.25; bossEyeX = bossX - unit.w / 5; bossEyeY = bossY - unit.h / 20;  break;
            case "b": bossStartAngle *= 0.75; bossStartAngle2 *= 1.25; bossEyeX = bossX - unit.w / 5; bossEyeY = bossY + unit.h / 20;  break;
            default: bossStartAngle = 0; break;
        }
    
        let fs = "yellow";
        GAME.d.fc(bossX, bossY, radius, bossStartAngle - biteAngle, bossStartAngle + Math.PI + biteAngle, {fs});
        GAME.d.fc(bossX, bossY, radius, bossStartAngle2 - biteAngle, bossStartAngle2 + Math.PI + biteAngle, {fs});
        GAME.d.fc(bossEyeX, bossEyeY, radius / 7, undefined, undefined, {fs: "black"});
    }
};

let drawPanel = () => {
    if(gameOver === true)
        GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} was Defeated!` : `${GAME.p.n} was Defeated!`);  
    else{
        GAME.d.dp();
        GAME.d.dmd(moving.x, moving.y);
    }
};

/** Lifecycle */
let onStart = _win => {
    //UI
    gamePosition = {
        x: GAME.c.w / 8,
        y: GAME.c.h / 20,
        w: GAME.c.w * 3 / 4,
        h: GAME.c.h * 3 / 4
    };
    startButton = {
        x: GAME.c.w / 2 - 90,
        y: GAME.c.h * 9 / 10 - 30,
        w: 180,
        h: 60
    };
    map = [ // 0 = empty, 1 = wall
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1,
        1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0,
        1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1,
        1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ];
    unit = {
        c: Math.sqrt(map.length),
        w: 0,
        h: 0
    };
    unit.w = gamePosition.w / unit.c;
    unit.h = gamePosition.h * unit.w / gamePosition.w;
    bossAnimation = {
        d: "c",
        b: 0
    };
    playerAnimation = {
        c: 0,  //current
        t: [    //types
            ["blue", "white"],
            ["royalblue", "white"]
        ]
    };

    //State
    tutorial = true;
    gameOver = false;
    mapPlayers = [
        21, 38,
        361, 378
    ];
    mapBoss = 210;
    lastMapBoss = mapBoss;
    mapFoods = [
            22, 26, 33, 37,
            44, 48, 51, 55,
            61, 78, 
            83, 87, 92, 96, 

            121, 124, 126, 133, 135, 138,
            148,
            166, 170, 173, 176, 
            181, 184, 198, 
            208, 211,
            226, 233,
            241, 244, 248, 251, 255, 258,

            282, 286, 293, 297,
            304, 315,
            321, 327, 332, , 338,

            362, 365, 368, 371, 374, 377
    ];
    time = 0;
    moving = {
        x: gamePosition.x + gamePosition.w / 2,
        y: gamePosition.y + gamePosition.h / 2
    };
    graph = {};

    //Engine
    GAME.p.d = 100;
    GAME.b.n = "Evil Pac";
    GAME.b.l = 100;
    GAME.b.d = 100 / mapFoods.length;
    GAME.b.d2 = 100 / mapPlayers.length - 1;
    GAME.b.p = [];

    GAME.e("click", clickStart, startButton.x, startButton.y, startButton.w, startButton.h);
    GAME.e("mousemove", mouseMove);

    //Other
    generateGraph();
};

let onUpdate = () => {
    logic();
    draw();
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export const PACMAN = {os: onStart, ou: onUpdate};