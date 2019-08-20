const GAME = require('./main').default;

/** Variables */
let newGame;
let win;

/** Events */
let click = (event, x, y) => {
    //New Game
    if(x > newGame.x && x < newGame.x + newGame.width && y > newGame.y && y < newGame.y + newGame.height)
        GAME.next();
};

/** Helper Functions */

/** State Functions */

/** Draw Functions */
let drawWin = () => {
    GAME.draw.fillText("You defeated all Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
};

let drawLose = () => {
    GAME.draw.fillText("You were defeated by Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
};

/** Game Loop */
let loop = () => {  
    if(win)
        drawWin();
    else
        drawLose();

    //New Game
    GAME.draw.fillText("Back to Future", newGame.x + newGame.width / 2, newGame.y + newGame.height / 2);
    GAME.draw.strokeRect(newGame.x, newGame.y, newGame.width, newGame.height);
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
    GAME.events.addClick(click);
};

// let onReset = () => {

// };

let onStop = () => {
    GAME.player.name = "";
    GAME.player.life = 100;
};

export default {loop, onStart, onStop};