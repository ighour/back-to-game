const { GAME } = require('../game');

/** Variables */
let newButton, reviveButton, monetizeButton, codeButton, win, textTimer;

/** Events */
let clickNew = () => {
    if(textTimer >= 1300){
        GAME.p.n = "";
        GAME.p.l = 100;
        GAME.n();
    }
};
let clickRevive = () => {
    if(textTimer >= 1300 && !win && GAME.m.s){
        GAME.r();
    }
        
};
let clickMonetize = () => {
    if(textTimer >= 1300){
        if(!GAME.m.a)
            window.open('https://coil.com', '_blank');
        else if(!GAME.m.s)
            window.open('https://coil.com/settings/payment', '_blank'); 
    }
};
let clickCode = () => {
    if(textTimer >= 1300)
        window.open('https://gitlab.com/ighour-projects/games/html/back-to-game','_blank');
};

/** Helper Functions */

/** Logic */
// let logic = () => {};

/** Draw */
let draw = () => {
    textTimer += GAME.dt;
    
    let x = GAME.c.x, y = GAME.c.y, w = x + GAME.c.w / 2;
    let sp = 40, tm = 50;

    if(win){
        GAME.d.ft("Congratulations!", w, y + 80, {f: 70});

        GAME.d.l(x + 20, y + 180, w * 2 - 20, y + 180);

        let texts = [
            {c: "You have rescued all corrupted games and defeated Evil Chess.", sp, tm},

            {c: "Now you can return home and safely play your games.", sp, tm},
        ];

        GAME.d.dtx(texts, w, y + 220, {f: 30}, textTimer);

        GAME.d.l(x + 20, y + 300, w * 2 - 20, y + 300);
    }

    else{
        GAME.d.ft("Game Over!", w, y + 80, {f: 70});

        GAME.d.l(x + 20, y + 160, w * 2 - 20, y + 160);

        let texts = [
            {c: "Gaming world is still being corrupted by Evil Chess.", sp, tm},

            {c: "Now you need to return home and try all again to save your games.", sp, tm},

            {c: "Unless you revive yourself to continue from last mission.", sp, tm},
        ];

        GAME.d.dtx(texts, w, y + 200, {f: 30}, textTimer);

        GAME.d.l(x + 20, y + 320, w * 2 - 20, y + 320);
    }

    sp = 70;

    let scores = GAME.p.s.map(s => Math.round(s)), totalScore = scores.reduce((c, s) => c + s, 0);

    let texts = [
        {c: "Score", tm: 200, x: w * 1.5 - 60, y: y + 380, s: {f: 40}},

        {c: "Pacman", tm: 100},
        {c: `${scores[1] ? scores[1] : 0} pts`, sp, tm: 70, ta: "r", x: w * 2 - 140},

        {c: "Pong", tm: 100},
        {c: `${scores[2] ? scores[2] : 0} pts`, sp, tm: 70, ta: "r", x: w * 2 - 140},

        {c: "Tic Tac Toe", tm: 100},
        {c: `${scores[3] ? scores[3] : 0} pts`, sp, tm: 70, ta: "r", x: w * 2 - 140},

        {c: "Chess", tm: 100},
        {c: `${scores[4] ? scores[4] : 0} pts`, sp, tm: 70, ta: "r", x: w * 2 - 140},

        {c: "Total", tm: 100},
        {c: `${totalScore} pts`, sp, tm: 70, ta: "r", x: w * 2 - 140},
    ];

    GAME.d.dtx(texts, w + 20, y + 430, {ta: "l", f: 30}, textTimer);

    drawButtons();
};

let drawButtons = () => {
    let fs = textTimer < 1300 ? "#999999" : undefined, y = newButton.y;

    GAME.d.db(newButton, "New Game", {fs, ss: fs});

    if(!win){
        y += 100;
        let color = !GAME.m.s ? "#999999" : fs;
        reviveButton.y = y;
        GAME.d.db(reviveButton, "Revive", {fs: color, ss: color});

        if(!GAME.m.s)
            GAME.d.dio("LO", reviveButton.x + reviveButton.w - 30, reviveButton.y + reviveButton.h / 2 + 2, color);
    }

    if(!GAME.m.s){
        y += 100;
        monetizeButton.y = y;
        GAME.d.db(monetizeButton, "Support Us", {fs, ss: fs});
    }
       
    y += 100;
    codeButton.y = y;
    GAME.d.db(codeButton, "View Code", {fs, ss: fs});
};

/** Lifecycle */
let onStart = _win => {
    let x = GAME.c.x + GAME.c.w / 2, y = GAME.c.y + GAME.c.h;

    //UI
    newButton = {
        x: x / 2 - 180,
        y: y - (_win ? 330 : 390),
        w: 360,
        h: 60
    };
    reviveButton = {
        x: x / 2 - 180,
        y,
        w: 360,
        h: 60
    };
    monetizeButton = {
        x: x / 2 - 180,
        y,
        w: 360,
        h: 60
    };
    codeButton = {
        x: x / 2 - 180,
        y,
        w: 360,
        h: 60
    };

    //State
    win = _win;
    textTimer = 0;

    //Engine
    GAME.e("click", clickNew, newButton);
    GAME.e("click", clickRevive, reviveButton);
    GAME.e("click", clickMonetize, monetizeButton);
    GAME.e("click", clickCode, codeButton);
};

let onUpdate = () => {  
    // logic();
    draw();
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export const GAMEOVER = {os: onStart, ou: onUpdate};