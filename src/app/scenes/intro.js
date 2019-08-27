const { GAME } = require('../game');

/** Variables */
let acceptButton, travelButton, keyboardPosition, keySize, capsLock, creating, name, keyboard, nameMax, nameRules, textTimer;

/** Events */
let clickAccept = () => {
    if(creating == false && textTimer >= 1000) creating = true;
};

let clickTravel = () => {
    if(creating && name.length > 0){
        GAME.p.n = name;
        GAME.n(true);
    }
};

let clickKeyboard = (event, x, y) => {
    if(creating){
        let keyIndex = Math.floor((x - keyboardPosition.x) / keySize.w) + Math.floor((y - keyboardPosition.y) / keySize.h) * 10;

        if(keyIndex === 29)
            capsLock = !capsLock;
        else if(keyIndex === 38){
            if(name.length > 0 && name.length < nameMax)
                name += " ";
        }
        else if(keyIndex === 39)
            name = name.slice(0, name.length - 1);
        else if(name.length < nameMax)
            name += capsLock ? keyboard[keyIndex] : keyboard[keyIndex].toLowerCase();
    }
};

let keyDown = (event) => {
    if(!creating)
        return;
        
    if(name.length < nameMax && event.key.length === 1 && nameRules.test(event.key))
        name += event.key;
    else if(event.keyCode === 8) //Backspace
        name = name.slice(0, name.length - 1);
    else if(event.keyCode === 20) //Caps Lock
        capsLock = !capsLock;
};

/** Helper Functions */

/** Logic */
// let logic = () => {};

/** Draw */
let draw = () => {
    textTimer += GAME.dt;

    if(creating === false){
        let x = GAME.c.x, y = GAME.c.y;

        GAME.d.ft("Back To Game", x + GAME.c.w / 2, y + 70, {f: 70});

        let sp = 70, tm = 50;

        let texts = [
            {c: "The year is 2019.", sp, tm},

            {c: "Chess is angry with technology because people prefer digital games.", sp, tm},

            {c: "He believes that he would be an important game again if he could reach", sp: sp / 1.8, tm},
            {c: "the most famous and classic digital games of history.", sp, tm},

            {c: "So he has decided to create an improved and digital version of chess and", sp: sp / 1.8, tm},
            {c: "send it back in time to corrupt those games.", sp, tm},

            {c: "The gaming world now has only one hope, a traveler able to rescue all", sp: sp / 1.8, tm},
            {c: "corrupted games and destroy the Evil Chess.", sp: sp * 1.1, tm},

            {c: "Do you accept this mission?", sp, tm, s: {ta: "c"}, x: x + GAME.c.w / 2},
        ];

        GAME.d.dtx(texts, x + 20, y + 190, {ta: "l", f: 30}, textTimer);

        if(textTimer >= 1000)
            GAME.d.db(acceptButton, "Accept");
    }

    else{
        let x = GAME.c.x + GAME.c.w / 2, y = GAME.c.y;

        //Call
        let texts = [
            "May I know your name,",
            "Traveler?"
        ];
        GAME.d.ftb(texts, x, y + 70, 70);

        //Input
        GAME.d.fr(x - 160, y + 200, 320, 46);
        GAME.d.ft(name, x, y + 222, {fs: "#222222"});

        //Keyboard
        GAME.d.sr(keyboardPosition.x, keyboardPosition.y, keyboardPosition.w, keyboardPosition.h, {ss: "#555555"});

        for(let i = 0; i < keyboard.length; i++){
            let key = keyboard[i];
    
            if(!capsLock && i > 9 && !["Caps", "_", "Space", "Del"].includes(key))
                key = key.toLowerCase();
    
            GAME.d.ft(key, keyboardPosition.x + keySize.w / 2 + keySize.w * (i % 10), keyboardPosition.y + keySize.h / 2 + keySize.h * Math.floor(i / 10), {f: 25});    
        }

        //Send Button
        if(name.length > 0)
            GAME.d.db(travelButton, "Time Travel");
    } 
};

/** Lifecycle */
let onStart = () => {
    let x = GAME.c.w / 2, y = GAME.c.h / 2;

    //UI
    acceptButton = {
        x: x - 90,
        y: y * 2 - 75,
        w: 180,
        h: 60
    };
    travelButton = {
        x: x - 140,
        y: y * 2 - 120,
        w: 280,
        h: 60
    };
    keyboardPosition = {
        x: x / 5,
        y: y * 0.9,
        w: x * 1.6,
        h: GAME.c.h / 3
    };
    keySize = {
        w: keyboardPosition.w / 10,
        h: keyboardPosition.h / 4
    };
    capsLock = false;

    //State
    creating = false;
    name = "";
    keyboard = [
        "1",    "2",    "3",    "4",    "5",    "6",    "7",    "8",    "9",    "0",
        "Q",    "W",    "E",    "R",    "T",    "Y",    "U",    "I",    "O",    "P",
        "A",    "S",    "D",    "F",    "G",    "H",    "J",    "K",    "L",    "Caps",
        "Z",    "X",    "C",    "V",    "B",    "N",    "M",    "_",    "Space","Del"
    ];
    nameMax = 8;
    nameRules = /[a-zA-Z0-9_ ]/;
    textTimer = 0;

    //Engine
    GAME.e("click", clickAccept, acceptButton.x, acceptButton.y, acceptButton.w, acceptButton.h);
    GAME.e("click", clickTravel, travelButton.x, travelButton.y, travelButton.w, travelButton.h);
    GAME.e("click", clickKeyboard, keyboardPosition.x, keyboardPosition.y, keyboardPosition.w, keyboardPosition.h);
    GAME.e("keydown", keyDown);
};

let onUpdate = () => {  
    // logic();
    draw();
};

// let onReset = () => {

// };

// let onStop = () => {
    
// };

export const INTRO = {os: onStart, ou: onUpdate};