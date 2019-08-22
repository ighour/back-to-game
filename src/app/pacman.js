const GAME = require('./main').default;

/** Variables */
let gamePosition, startPosition, panelPosition, unit, map, bossAnimation;
let tutorial, boss, gameOver, mapPlayers, mapBoss, mapFoods, time;

/** Events */
let click = (event, x, y) => {
    if(tutorial){
        //Start Button
        if(x > startPosition.x && x < startPosition.x + startPosition.width && y > startPosition.y && y < startPosition.y + startPosition.height)
            tutorial = false;
    }
};

let mouseMove = (event, x, y) => {
    if(!tutorial && x > gamePosition.x && x < gamePosition.x + gamePosition.width && y > gamePosition.y && y < gamePosition.y + gamePosition.height){

    }
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

/** State Functions */
let logic = () => {
    time += GAME.delta;

    if(time >= 400)
        bossAnimation.bite = 2;
    else if(time >= 320)
        bossAnimation.bite = 1;
    else if(time >= 240)
        bossAnimation.bite = 0;
    else if(time >= 160)
        bossAnimation.bite = 2;
    else if(time >= 80)
        bossAnimation.bite = 1;

    if(time >= 500){  //1000ms
        bossMove();

        time = 0;
    }
};

let bossThink = () => {
    if(boss.target !== mapBoss || mapFoods.length === 0)
        return;

    let bossCoords = getUnitXY(mapBoss);

    boss.target = mapFoods.map(e => {
        let coords = getUnitXY(e);
        let mag = GAME.functions.getMagVector(coords.x - bossCoords.x, coords.y - bossCoords.y);
        return {
            index: e,
            mag
        };
    })
    .sort((a, b) => a.mag === b.mag ? 0 : (a.mag < b.mag ? -1 : 1))
    .shift()
    .index;
};

let bossMove = () => {
    let can = canMove(mapBoss);
    
    //Random
    let targets = Object.values(can).filter(e => e !== -1);
    let target = targets[Math.floor(Math.random() * targets.length)];

    //Animation
    switch(target){
        case can.l: bossAnimation.dir = "l"; break;
        case can.r: bossAnimation.dir = "r"; break;
        case can.t: bossAnimation.dir = "t"; break;
        case can.b: bossAnimation.dir = "b"; break;
    }

    mapBoss = target;

    //Eat food?
    mapFoods = mapFoods.filter(e => {
        if(e === mapBoss){
            gameOver = GAME.functions.doDamage(GAME.player, boss.damage);
            if(!gameOver)
                bossThink();
            return false;
        }

        return true;
    });
};

/** Draw Functions */
let drawTutorial = () => {
    let intel = [
        "...",
        "...",
        "..."
    ];

    GAME.draw.drawTutorial("Mission #1", "1980", boss.name, intel, startPosition);
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
    //Foods
    mapFoods.forEach(e => {
        let coords = getUnitXY(e);
        GAME.draw.fillRect(coords.x, coords.y, unit.width, unit.height, {fillStyle: "purple"});
    });

    //Players
    Object.values(mapPlayers).forEach(e => {
        let coords = getUnitXY(e);
        GAME.draw.fillRect(coords.x, coords.y, unit.width, unit.height, {fillStyle: "blue"});
    });

    //Boss
    let bossCoords = getUnitXY(mapBoss);
    let bossX = bossCoords.x + unit.width / 2, bossY = bossCoords.y + unit.height / 2;
    let radius = unit.width >= unit.height ? unit.height / 2 : unit.width / 2;
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
};

let drawBoard = () => {
    drawMap();
    drawTargets();
};

let drawGameOver = () => {
    GAME.draw.drawGameOver(panelPosition, boss);
};

let drawBasePanel = () => {
    // Players
    GAME.draw.drawPlayerPanel(panelPosition, boss);
};

let drawPanel = () => {
    if(gameOver === true)
        drawGameOver();  
    else
        drawBasePanel();
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
    startPosition = {
        x: GAME.canvas.width / 2 - 90,
        y: GAME.canvas.height * 5 / 6 - 30,
        width: 180,
        height: 60
    };
    panelPosition = {
        x: 0,
        y: gamePosition.y + gamePosition.height + 20,
        width: GAME.canvas.width,
        height: GAME.canvas.height - (gamePosition.y + gamePosition.height + 20) - 1
    };
    map = [ // 0 = empty, 1 = wall
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
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

    //State
    tutorial = true;
    gameOver = false;
    mapPlayers = {
        p1: 21,
        p2: 38,
        p3: 361,
        p4: 378
    };
    mapBoss = 210;
    mapFoods = [
            22, 26, 33, 37,
            44, 48, 51, 55,
            61, 78, 
            83, 87, 92, 96, 

            121, 124, 126, 133, 135, 138,
            148, 151,
            166, 174, 
            181, 184, 195, 198, 
            208, 211,
            226, 233,
            241, 244, 248, 251, 255, 258,

            282, 286, 293, 297,
            304, 315,
            321, 327, 332, , 338,

            362, 365, 368, 371, 374, 377
    ];
    boss = {
        name: "Evil Pac",
        life: 100,
        damage: 100 / mapFoods.length,
        target: mapBoss
    };
    time = 0;

    //Engine
    GAME.player.damage = 100;
    GAME.events.addMouseMove(mouseMove);
    GAME.events.addClick(click);

    bossThink();
};

let onUpdate = () => {
    if(tutorial)
        drawTutorial();
    else {
        if(!gameOver)
            logic();

        //Game
        drawBoard();

        //Panel
        drawPanel();
    }
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export default {onStart, onUpdate};