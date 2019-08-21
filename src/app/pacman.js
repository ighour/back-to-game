const GAME = require('./main').default;

/** Variables */
let gamePosition, startPosition, panelPosition, unit, map;
let tutorial, boss, gameOver;

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

/** State Functions */

/** Draw Functions */
let drawTutorial = () => {
    let intel = [
        "...",
        "...",
        "..."
    ];

    GAME.draw.drawTutorial("Mission #1", "1980", boss.name, intel, startPosition);
};

let drawBoard = () => {
    for(let i = 0; i < map.length; i++){
        let x = gamePosition.x + unit.width * (i % unit.count);
        let y = gamePosition.y + unit.height * Math.floor(i / unit.count);

        let current = map[i];

        if(current === 0)   //Empty
            GAME.draw.fillRect(x, y, unit.width, unit.height, {fillStyle: "#666666"});
        else if(current === 1){  //Wall
            GAME.draw.fillRect(x, y, unit.width, unit.height);
            GAME.draw.strokeRect(x, y, unit.width, unit.height, {strokeStyle: "#EEEEEE"});
        }
        else if(current === 2)  //Pacman
            GAME.draw.fillRect(x, y, unit.width, unit.height, {fillStyle: "yellow"});
        else if(current === 3)  //Player
            GAME.draw.fillRect(x, y, unit.width, unit.height, {fillStyle: "lightgreen"});
        else if(current === 4)  //Pacman Target
            GAME.draw.fillRect(x, y, unit.width, unit.height, {fillStyle: "purple"});
    }
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
    map = [ // 0 = empty, 1 = wall, 2 = pacman, 3 = player, 4 = pacman target
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 3, 4, 0, 0, 0, 4, 0, 0, 1, 1, 0, 0, 4, 0, 0, 0, 4, 3, 1,
        1, 0, 1, 1, 4, 1, 1, 1, 4, 0, 0, 4, 1, 1, 1, 4, 1, 1, 0, 1,
        1, 4, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 4, 1,
        1, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1,
        1, 4, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 4, 1,
        1, 1, 1, 1, 0, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 4, 0, 0, 1, 1, 0, 0, 4, 1, 0, 1, 1, 1, 1,
        0, 4, 0, 0, 4, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 4, 0, 0, 4, 0,
        1, 1, 1, 1, 0, 1, 0, 0, 4, 0, 2, 4, 0, 0, 1, 0, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 4, 1, 1, 1, 1, 1, 1, 4, 1, 0, 1, 1, 1, 1,
        1, 4, 0, 0, 4, 0, 0, 0, 4, 1, 1, 4, 0, 0, 0, 4, 0, 0, 4, 1,
        1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 4, 1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 4, 0, 1,
        1, 1, 0, 1, 4, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 4, 1, 0, 1, 1,
        1, 4, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 4, 1,
        1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
        1, 3, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 3, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ];
    unit = {
        count: Math.sqrt(map.length),
        width: 0,
        height: 0
    };
    unit.width = gamePosition.width / unit.count;
    unit.height = gamePosition.height * unit.width / gamePosition.width;

    //State
    boss = {
        name: "Evil Pac",
        life: 100,
        damage: 1
    };
    tutorial = true;
    gameOver = false;

    //Engine
    GAME.player.damage = 100;
    GAME.events.addMouseMove(mouseMove);
    GAME.events.addClick(click);
};

let onUpdate = () => {
    if(tutorial)
        drawTutorial();
    else {
        //Logic

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