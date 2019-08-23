const GAME = require('../game').default;

/** Variables */
let newGame;
let win;

/** Helper Functions */

/** State Functions */

/** Draw Functions */
let drawWin = () => {
    GAME.draw.fillText("You defeated all Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
};

let drawLose = () => {
    GAME.draw.fillText("You were defeated by Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
};

/** Events */
let clickNew = () => GAME.next();

/** Lifecycle */
let onStart = _win => {
    //UI
    newGame = {
        x: GAME.canvas.width / 2 - 180,
        y: GAME.canvas.height * 2 / 3,
        width: 360,
        height: 60
    };

    //State
    win = _win;

    //Engine
    GAME.addEvent("click", clickNew, newGame.x, newGame.y, newGame.width, newGame.height);
};

let onUpdate = () => {  
    if(win)
        drawWin();
    else
        drawLose();

    //New Game
    GAME.draw.drawButton(newGame, "Back to Future");
};

// let onReset = () => {

// };

let onStop = () => {
    GAME.player.name = "";
    GAME.player.life = 100;
};

export default {onStart, onUpdate, onStop};