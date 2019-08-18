const GAME = require('./main').default;

/** Variables */
let UI = document.querySelector("#game");
let nameInput;
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
    nameInput = document.createElement("div");
    nameInput.style.position = "relative";
    nameInput.style.top = (-1 * GAME.canvas.height / 3) + "px";

    let input = document.createElement("input");
    input.type = "text";
    input.maxLength = 8;
    input.autofocus = true;
    input.style.width = "240px";
    input.style.height = "60px";
    input.style.fontSize = "40pt";
    input.style.margin = "0";
    input.style.padding = "0";
    nameInput.appendChild(input);

    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = ">";
    submit.style.width = "40px";
    submit.style.height = "64px";
    submit.style.fontSize = "40pt";
    submit.style.margin = "1px 0 0 0";
    submit.style.padding = "0";
    nameInput.appendChild(submit);

    UI.appendChild(nameInput);

    submit.addEventListener("click", event => {
        if(input.value.length > 0)
            beginGame(input.value);
    });
};

let beginGame = name => {
    GAME.player.name = name;
    UI.removeChild(nameInput);
    GAME.next("tictactoe");
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
    GAME.draw.fillText("Back to 1950", startPosition.x + startPosition.width / 2, startPosition.y + startPosition.height / 2);
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