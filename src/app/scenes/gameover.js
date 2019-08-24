const { GAME } = require('../game');

/** Variables */
let newGame, win;

/** Events */
let clickNew = () => GAME.n();

/** Helper Functions */

/** Logic */
// let logic = () => {};

/** Draw */
let draw = () => {
    GAME.d.ft(win ? "You defeated all Evil Games!" : "You were defeated by Evil Games!", GAME.c.w / 2, GAME.c.h / 4);

    //New Game
    GAME.d.db(newGame, "Back to Future");
};

/** Lifecycle */
let onStart = _win => {
    //UI
    newGame = {
        x: GAME.c.w / 2 - 180,
        y: GAME.c.h * 2 / 3,
        w: 360,
        h: 60
    };

    //State
    win = _win;

    //Engine
    GAME.e("click", clickNew, newGame.x, newGame.y, newGame.w, newGame.h);
};

let onUpdate = () => {  
    // logic();
    draw();
};

// let onReset = () => {

// };

let onStop = () => {
    GAME.p.n = "";
    GAME.p.l = 100;
};

export const GAMEOVER = {os: onStart, ou: onUpdate, ost: onStop};