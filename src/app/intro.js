const GAME = require('./main').default;

/** Variables */
let creating = false;
let name = "";

/** UI */
let startPosition = {
    x: GAME.canvas.width / 2 - 180,
    y: GAME.canvas.height * 5 / 6 - 30,
    width: 360,
    height: 60
};

/** Events */
let click = (event, x, y) => {
    //Start Button
    if(x > startPosition.x && x < startPosition.x + startPosition.width && y > startPosition.y && y < startPosition.y + startPosition.height){
        if(!creating)
            creating = true;
        else if(name.length > 0)
            beginGame();
    }
};

let keyDown = (event) => {
    let key = event.key;

    if(validKeyForName(key) && name.length < 8)
        name += key;
    else if(event.keyCode === 8) //Backspace
        name = name.slice(0, name.length - 1);
    else if(event.keyCode === 13 && name.length > 0) //Enter
        beginGame();
};

/** Helper Functions */
let beginGame = () => {
    GAME.player.name = name;
    GAME.gameOver(true);
};

let validKeyForName = key => {
    return key.length === 1 && /[a-zA-Z0-9]/.test(key);
};

/** State Functions */

/** Draw Functions */
let drawNew = () => {
    //Title
    GAME.draw.fillText("Back To #", GAME.canvas.width / 2, GAME.canvas.height / 5, {font: "100px Arial"});

    //Brief
    let texts = [
        "Welcome to a journey back through time",
        "where some games were corrupted.",
        "Now only a true gamer",
        "can proceed!"
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 2, GAME.canvas.height * 2 / 5, 70);

    //Start Game
    GAME.draw.fillText("Start Game", startPosition.x + startPosition.width / 2, startPosition.y + startPosition.height / 2);
    GAME.draw.strokeRect(startPosition.x, startPosition.y, startPosition.width, startPosition.height);
};

let drawCreate = () => {
    //Call
    let texts = [
        "May I know your name,",
        "Traveler?"
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 2, GAME.canvas.height / 3, 70);

    //Input
    GAME.draw.fillRect(GAME.canvas.width/ 3, GAME.canvas.height * 3 / 5, GAME.canvas.width / 3, 46);
    GAME.draw.fillText(name, GAME.canvas.width / 2, GAME.canvas.height * 3 / 5 + 23, {fillStyle: "#222222"});

    //Send Name
    if(name.length > 0){
        GAME.draw.fillText("Time Travel", startPosition.x + startPosition.width / 2, startPosition.y + startPosition.height / 2);
        GAME.draw.strokeRect(startPosition.x, startPosition.y, startPosition.width, startPosition.height);
    }
};

/** Game Loop */
let start = () => {  
    if(creating === false)
        drawNew();
    else
        drawCreate();  
};

export default {
    start: () => {
        GAME.events.addClick(click);
        GAME.events.addKeyDown(keyDown);
        GAME.start(start)
    },
    stop: () => {
        creating = false;
        GAME.stop()
    }
};