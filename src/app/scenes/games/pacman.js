const GAME = require('../../game').default;

/** Variables */
let gamePosition, startButton, unit, map, bossAnimation, foodAnimation;
let tutorial, gameOver, mapPlayers, mapBoss, lastMapBoss, mapFoods, time, moving, graph;

/** Events */
let clickStart = () => tutorial = false;

let mouseMove = (event, x, y) => {
    if(!tutorial)
        moving = GAME.functions.getNormalizedVector(x - (gamePosition.x + gamePosition.width / 2), y - (gamePosition.y + gamePosition.height / 2));
};

/** Helper Functions */
let getUnitXY = index => {
    return {
        x: gamePosition.x + unit.width * (index % unit.count),
        y: gamePosition.y + unit.height * Math.floor(index / unit.count)
    };
};

let getNearIndex = (dir, index) => {
    switch(dir){
        case "l": return index % unit.count === 0 ? index + unit.count - 1 : index - 1;
        case "r": return index % unit.count === unit.count - 1 ? index - unit.count + 1 : index + 1;
        case "t": return Math.floor(index / unit.count) === 0 ? index + unit.count * (unit.count - 1) : index - unit.count;
        case "b": return Math.floor(index / unit.count) === unit.count - 1 ? index - unit.count * (unit.count - 1) : index + unit.count;
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

    time += GAME.delta;

    if(time >= 250){
        bossAnimation.bite = 0;
        foodAnimation = {bgColor: "royalblue", color: "white"};
    }
    else if(time >= 200){
        bossAnimation.bite = 2;
        foodAnimation = {bgColor: "blue", color: "white"};
    }
    else if(time >= 150){
        bossAnimation.bite = 1;
        foodAnimation = {bgColor: "royalblue", color: "white"};
    }
    else if(time >= 100){
        bossAnimation.bite = 0;
        foodAnimation = {bgColor: "blue", color: "white"};
    }
    else if(time >= 50){
        bossAnimation.bite = 2;
        foodAnimation = {bgColor: "royalblue", color: "white"};
    }
    else if(time >= 0){
        bossAnimation.bite = 1;
        foodAnimation = {bgColor: "blue", color: "white"};
    }
 
    if(time >= 300){  //300ms
        bossMove();
        playersMove();
        checkCollisions();

        time = 0;
    }
};

let bossMove = () => {
    if(!gameOver && mapFoods.length > 0 && GAME.boss.path.length === 0)
        bossThink();

    //Pursuit
    if(GAME.boss.path.length > 0){
        let target = GAME.boss.path.shift();

        lastMapBoss = mapBoss;
        mapBoss = target;

        //Animation
        if(mapBoss === getNearIndex("l", lastMapBoss))
            bossAnimation.dir = "l";
        else if(mapBoss === getNearIndex("r", lastMapBoss))
            bossAnimation.dir = "r";
        else if(mapBoss === getNearIndex("t", lastMapBoss))
            bossAnimation.dir = "t";
        else if(mapBoss === getNearIndex("b", lastMapBoss))
            bossAnimation.dir = "b";
    }
};

let bossThink = () => {
    let target = graph.iteratorBFS(mapBoss, index => mapFoods.includes(index)).pop();

    if(target !== undefined)
        GAME.boss.path = graph.iteratorShortestPath(mapBoss, target);
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
                gameOver = mapPlayers.length === 1 ? GAME.functions.doDamageBoss() : GAME.functions.doDamagePlayer(GAME.boss.damage2);
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
        gameOver = GAME.functions.doDamageBoss();
    else
        mapPlayers = mapPlayers.filter(e => {
            if(e === mapBoss){
                if(!gameOver)
                    gameOver = GAME.functions.doDamagePlayer(GAME.boss.damage2);
                return false;
            }
    
            return true;
        });

    //Eat food?
    mapFoods = mapFoods.filter(e => {
        if(e === mapBoss){
            if(!gameOver)
                gameOver = GAME.functions.doDamagePlayer();
            return false;
        }

        return true;
    });
};

let generateGraph = () => {
    graph = new GAME.dataStructures.graph();

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
        GAME.draw.drawTutorial("Mission #1", "1980", intel, startButton);
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
            GAME.draw.fillRect(coords.x, coords.y, unit.width, unit.height);
            GAME.draw.strokeRect(coords.x, coords.y, unit.width, unit.height, {strokeStyle: "#EEEEEE"});
        }
        else
            GAME.draw.fillRect(coords.x, coords.y, unit.width, unit.height, {fillStyle: "#666666"});
    }
};

let drawTargets = () => {
    let radius = unit.width >= unit.height ? unit.height / 2 : unit.width / 2;

    //Foods
    mapFoods.forEach(e => {
        let coords = getUnitXY(e);
        GAME.draw.fillCircle(coords.x + unit.width / 2, coords.y + unit.height / 2, radius / 8);
    });

    //Players
    mapPlayers.forEach(e => {
        let coords = getUnitXY(e);
        let playerX = coords.x + unit.width / 2, playerY = coords.y + unit.height / 2;
        let bgColor = mapPlayers.length === 1 ? "orange" : foodAnimation.bgColor;
        let color = mapPlayers.length === 1 ? "royalblue" : foodAnimation.color;

        GAME.draw.fillCircle(playerX, playerY, radius, undefined, undefined, {fillStyle: bgColor});
        GAME.draw.fillRect(playerX - radius, playerY, radius * 2, radius * 9 / 10, {fillStyle: bgColor});

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
                GAME.draw.line(m[0], m[1], m[2], m[3], {strokeStyle: color});
            });
        }

        GAME.draw.fillCircle(playerX - radius / 3, playerY - radius / 2, radius / 8, undefined, undefined, {fillStyle: color});
        GAME.draw.fillCircle(playerX + radius / 3, playerY - radius / 2, radius / 8, undefined, undefined, {fillStyle: color});
    });

    //Boss
    if(GAME.boss.life > 0){
        let bossCoords = getUnitXY(mapBoss);
        let bossX = bossCoords.x + unit.width / 2, bossY = bossCoords.y + unit.height / 2;
        let bossStartAngle = Math.PI, bossStartAngle2 = Math.PI, bossEyeX, bossEyeY, biteAngle = Math.PI / 8 * bossAnimation.bite;
        switch(bossAnimation.dir){
            case "l": bossStartAngle *= 1.25; bossStartAngle2 *= 1.75; bossEyeX = bossX + unit.width / 20; bossEyeY = bossY - unit.width / 5; break;
            case "r": bossStartAngle *= 0.25; bossStartAngle2 *= 0.75; bossEyeX = bossX - unit.width / 20; bossEyeY = bossY - unit.width / 5;  break;
            case "t": bossStartAngle *= 1.75; bossStartAngle2 *= 0.25; bossEyeX = bossX - unit.width / 5; bossEyeY = bossY - unit.height / 20;  break;
            case "b": bossStartAngle *= 0.75; bossStartAngle2 *= 1.25; bossEyeX = bossX - unit.width / 5; bossEyeY = bossY + unit.height / 20;  break;
            default: bossStartAngle = 0; break;
        }
    
        GAME.draw.fillCircle(bossX, bossY, radius, bossStartAngle - biteAngle, bossStartAngle + Math.PI + biteAngle, {fillStyle: "yellow"});
        GAME.draw.fillCircle(bossX, bossY, radius, bossStartAngle2 - biteAngle, bossStartAngle2 + Math.PI + biteAngle, {fillStyle: "yellow"});
        GAME.draw.fillCircle(bossEyeX, bossEyeY, radius / 7, undefined, undefined, {fillStyle: "black"});
    }
};

let drawPanel = () => {
    if(gameOver === true)
        GAME.draw.drawGameOver();  
    else{
        GAME.draw.drawPanel();
        GAME.draw.drawMouseDirection(moving.x, moving.y); 
    }
};

/** Lifecycle */
let onStart = _win => {
    //UI
    gamePosition = {
        x: GAME.canvas.width / 8,
        y: GAME.canvas.height / 20,
        width: GAME.canvas.width * 3 / 4,
        height: GAME.canvas.height * 3 / 4
    };
    startButton = {
        x: GAME.canvas.width / 2 - 90,
        y: GAME.canvas.height * 9 / 10 - 30,
        width: 180,
        height: 60
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
        count: Math.sqrt(map.length),
        width: 0,
        height: 0
    };
    unit.width = gamePosition.width / unit.count;
    unit.height = gamePosition.height * unit.width / gamePosition.width;
    bossAnimation = {
        dir: "c",
        bite: 0
    };
    foodAnimation = {
        bgColor: "blue",
        color: "white"
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
        x: gamePosition.x + gamePosition.width / 2,
        y: gamePosition.y + gamePosition.height / 2
    };
    graph = {};

    //Engine
    GAME.player.damage = 100;
    GAME.boss.name = "Evil Pac";
    GAME.boss.life = 100;
    GAME.boss.damage = 100 / mapFoods.length;
    GAME.boss.damage2 = 100 / mapPlayers.length - 1;
    GAME.boss.path = [];

    GAME.addEvent("click", clickStart, startButton.x, startButton.y, startButton.width, startButton.height);
    GAME.addEvent("mousemove", mouseMove);

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

export default {onStart, onUpdate};