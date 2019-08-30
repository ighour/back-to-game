const { GAME } = require('../../game');

/** Variables */
let gamePosition, travelButton, startButton, unit, map, bossAnimation, playerAnimation, tutorial, gameOver, mapPlayers, mapBoss, lastMapBoss, mapFoods, time, timeAnimation, moving, graph, textTimer, scoreChange;

/** Events */
let clickTravel = () => {
    if(tutorial == 1){
        setTimeout(() => {textTimer = 0; tutorial = 2}, 100);
    }
};

let clickStart = () => {
    if(tutorial == 2){
        tutorial = 0;
    }
};

let mouseMove = (event, x, y) => {
    if(tutorial == 0)
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

let canMoveSide = (side, index) => {
    let nearIndex = getNearIndex(side, index);
    return map[nearIndex] === 1 ? -1 : nearIndex;
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
    if(tutorial != 0 || gameOver)
        return;

    time += GAME.dt;
    timeAnimation += GAME.dt;

    if(timeAnimation >= 90){    //50ms
        bossAnimation.b = (bossAnimation.b + 1) % 2;
        playerAnimation.c = (playerAnimation.c + 1) % 2;

        timeAnimation = 0;
    }

    if(time >= 300){  //300ms
        bossMove();
        playersMove();
        checkCollisions();

        time = 0;
    }
};

let bossMove = () => {
    if(GAME.p.m != 1 && Math.random() <= 0.25)
        return;

    if(!gameOver && mapFoods.length > 0 && GAME.b.p.length === 0){
        let target = graph.BFS(mapBoss, index => mapFoods.includes(index) && (mapFoods.length <= 1 || Math.random() <= 0.9)).pop();

        if(target !== undefined)
            GAME.b.p = graph.shortestPath(mapBoss, target);
    }

    //Pursuit
    if(GAME.b.p.length > 0){
        let target = GAME.b.p.shift();

        lastMapBoss = mapBoss;
        mapBoss = target;

        //Animation
        let dirs = ["l", "r", "t", "b"];
        for(let i = 0; i < dirs.length; i++){
            if(mapBoss === getNearIndex(dirs[i], lastMapBoss)){
                bossAnimation.d = dirs[i];
                break;
            }
        }
    }
};

let playersMove = () => {
    let preferHorizontal = Math.abs(moving.x) >= Math.abs(moving.y);

    mapPlayers = mapPlayers.map(e => {
        let can = {
            l: canMoveSide("l", e),
            r: canMoveSide("r", e),
            t: canMoveSide("t", e),
            b: canMoveSide("b", e),
        }, newIndex = -1;

        newIndex = playerChooseMove(preferHorizontal ? moving.x : moving.y, preferHorizontal ? can.l : can.t, preferHorizontal ? can.r : can.b);

        if(newIndex === -1 && Math.abs(preferHorizontal ? moving.y : moving.x) >= 0.2)
            newIndex = playerChooseMove(preferHorizontal ? moving.y : moving.x, preferHorizontal ? can.t : can.l, preferHorizontal ? can.b : can.r);

        return newIndex === -1 ? e : newIndex;
    })
    .filter(e => {
        //Avoid swiping with boss
        if(e === lastMapBoss){
            if(!gameOver)
                gameOver = mapPlayers.length === 1 ? GAME.f.db() : GAME.f.dp(GAME.b.d2, scoreChange[0]);
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
                    gameOver = GAME.f.dp(GAME.b.d2, scoreChange[0]);
                return false;
            }
    
            return true;
        });

    //Eat food?
    mapFoods = mapFoods.filter(e => {
        if(e === mapBoss){
            if(!gameOver)
                gameOver = GAME.f.dp(undefined, scoreChange[1]);
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
                let near = getNearIndex(e, i);
                let neighbor = map[near] === 0 ? near : -1;

                if(neighbor !== -1)
                    graph.addEdge(i, neighbor);
            });
        }
    }
};

/** Draw */
let draw = () => {
    if(tutorial != 0){
        textTimer += GAME.dt;

        let sp = 70, tm = 50;

        GAME.d.dt(tutorial,
            ["Mission #1", "Controls"],
            [
                [
                    {c: "The year is 1980.", sp, tm},
    
                    {c: "Evil Chess has taken control of Pac Man. Your first mission is to defeat", sp: sp / 1.8, tm},
                    {c: "Pac Man in order to restart it.", sp, tm},
        
                    {c: "You will be given control of the ghosts and aim to eat Pac Man.", sp, tm},
        
                    {c: "However, to be able to eat Pac Man, you will need to gather all weakened", sp: sp / 1.8, tm},
                    {c: "ghosts into one.", sp, tm},
        
                    {c: "Be careful, Pac Man can eat your weakened ghosts and foods along the", sp: sp / 1.8, tm},
                    {c: "map, and this can hurt you.", sp: sp * 1.1, tm},
        
                    {c: "Do you accept this mission?", sp, tm, s: {ta: "c"}, x: GAME.c.x + GAME.c.w / 2},
                ],
                [
                    {c: "- Use your mouse to move through the game board.", sp, tm},
        
                    {c: "- You control the ghosts direction with the position of your mouse.", sp, tm},
        
                    {c: "- If you're in the left side of map, ghosts will go to left.", sp, tm},
        
                    {c: "- If you're in the top side of map, ghosts will go to top.", sp, tm},
        
                    {c: "- The same to right side and bottom side.", sp, tm},

                    {c: "- Check the panel at bottom to see which direction are you pointing now.", sp, tm},
                ]
            ],
            textTimer,
            [travelButton, startButton],
            ["Travel to 1980", "Play"]
        );
    }

    else {
        //Map
        for(let i = 0; i < map.length; i++){
            let coords = getUnitXY(i);
    
            if(map[i] === 1){
                GAME.d.fr(coords.x, coords.y, unit.w, unit.h);
                GAME.d.sr(coords.x, coords.y, unit.w, unit.h, {ss: "#EEEEEE"});
            }
            else
                GAME.d.fr(coords.x, coords.y, unit.w, unit.h, {fs: "#666666"});
        }

        //Targets
        drawTargets();

        //Panel
        if(gameOver === true)
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} is now rebooting...` : `${GAME.p.n} was Defeated!`);  
        else{
            GAME.d.dp();

            //Direction pointer
            let x = GAME.c.p.x + GAME.c.p.w / 2, y = GAME.c.p.y + GAME.c.p.h / 2;

            GAME.d.fc(x, y, 5);

            let L1 = 40, L2 = 15, angle = 0.7;
            let x1 = x, y1 = y;
            let x2 = x1 + L1 * moving.x, y2 = y1 + L1 * moving.y;
        
            GAME.d.l(x2, y2, x2 + L2 / L1 * ((x1 - x2) * Math.cos(angle) + (y1 - y2) * Math.sin(angle)), 
                y2 + L2 / L1 * ((y1 - y2) * Math.cos(angle) - (x1 - x2) * Math.sin(angle)));
    
            GAME.d.l(x2, y2, x2 + L2 / L1 * ((x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle)), 
                y2 + L2 / L1 * ((y1 - y2) * Math.cos(angle) + (x1 - x2) * Math.sin(angle)));
        }
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
    travelButton = {
        x: x - 180,
        y: y * 2 - 75,
        w: 360,
        h: 60
    };
    startButton = {
        x: x - 120,
        y: y * 2 - 100,
        w: 240,
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
    tutorial = 1;
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
    timeAnimation = 0;
    moving = {
        x,
        y
    };
    graph = {};
    textTimer = 0;
    scoreChange = [
        -300 / mapPlayers.length, //eat player
        -700 / mapFoods.length, //eat food
    ];

    //Engine
    GAME.p.d = 100;
    GAME.p.s[GAME.cu()] = 1000 / Math.pow(GAME.p.m, 2);
    GAME.b.n = "Pacman";
    GAME.b.l = 100;
    GAME.b.d = 100 / (mapFoods.length - 1);
    GAME.b.d2 = 20 / GAME.p.m;
    GAME.b.p = [];

    GAME.e("click", clickTravel, travelButton);
    GAME.e("click", clickStart, startButton);
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