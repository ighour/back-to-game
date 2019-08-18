const GAME = require('./main').default;

/** Variables */
let nameInput = document.querySelector("#game-form");
let creating = false;

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
    if(creating === false && x > startPosition.x && x < startPosition.x + startPosition.width && 
        y > startPosition.y && y < startPosition.y + startPosition.height){
        creating = true;
        makeNameInput();
    }
};

/** Helper Functions */
let makeNameInput = () => {
    nameInput.style.top = (-1 * GAME.canvas.height / 3) + "px";
    nameInput.style.display = "block";

    let input = nameInput.querySelector("input[type='text']");
    let btn = nameInput.querySelector("input[type='submit']");

    input.autofocus = true;

    btn.addEventListener("click", event => {
        if(input.value.length > 0)
            beginGame(input.value);
    });
};

let beginGame = name => {
    GAME.player.name = name;
    nameInput.style.display = "none";
    GAME.gameOver(true);
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
        "What is your name,",
        "Traveler?"
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 2, GAME.canvas.height / 3, 70);
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
        GAME.start(start)
    },
    stop: () => {
        creating = false;
        GAME.stop()
    }
};