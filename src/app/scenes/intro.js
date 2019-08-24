const { GAME } = require('../game');

/** Variables */
let startButton, keyboardPosition, keySize, capsLock, creating, name, keyboard, nameMax, nameRules;

/** Events */
let clickStart = () => {
    creating = true;

    if(name.length > 0){
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
    let x = GAME.c.w / 2, y = GAME.c.h / 2;

    if(creating === false){
        //Title
        GAME.d.ft("Back To #", x, y / 4, {f: 100});

        //Brief
        let texts = [
            "Welcome to a journey back through time",
            "where some games were corrupted.",
            "Now only a true gamer",
            "can proceed!"
        ];
        GAME.d.ftb(texts, x, y / 1.3, 70);

        //Start Button
        GAME.d.db(startButton, "Start Game");
    }

    else{
        //Call
        let texts = [
            "May I know your name,",
            "Traveler?"
        ];
        GAME.d.ftb(texts, x, y / 4, 70);

        //Input
        GAME.d.fr(x - 160, y / 1.7, 320, 46);
        GAME.d.ft(name, x, y / 1.7 + 23, {fs: "#222222"});

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
            GAME.d.db(startButton, "Time Travel");
    } 
};

/** Lifecycle */
let onStart = () => {
    let x = GAME.c.w / 2, y = GAME.c.h / 2;

    //UI
    startButton = {
        x: x - 170,
        y: y * 1.7,
        w: 340,
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

    //Engine
    GAME.e("click", clickStart, startButton.x, startButton.y, startButton.w, startButton.h);
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