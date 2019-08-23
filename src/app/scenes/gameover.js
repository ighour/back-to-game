const GAME = require('../game').default;

/** Variables */
let newGame;
let win;

/** Events */
let clickNew = () => GAME.next();

/** Helper Functions */

/** Logic */
// let logic = () => {};

/** Draw */
let draw = () => {
    if(win)
        GAME.draw.fillText("You defeated all Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
    else
        GAME.draw.fillText("You were defeated by Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);

    //New Game
    GAME.draw.drawButton(newGame, "Back to Future");
};

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
    // logic();
    draw();
};

// let onReset = () => {

// };

let onStop = () => {
    GAME.player.name = "";
    GAME.player.life = 100;
};

export default {onStart, onUpdate, onStop};