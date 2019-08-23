const { GAME } = require('../game');

/** Variables */
let startButton, keyboardPosition, keySize, capsLock;
let creating, name, keyboard, nameMax, nameRules;

/** Events */
let clickStart = () => {
    //Create
    if(!creating)
        creating = true;
    //Start
    else if(name.length > 0)
        beginGame();
};

let clickKeyboard = (event, x, y) => {
    if(creating)
        pressKey(x, y);
};

let keyDown = (event) => {
    if(!creating)
        return;
        
    let key = event.key;

    if(validKeyForName(key) && name.length < nameMax)
        name += key;
    else if(event.keyCode === 8) //Backspace
        name = name.slice(0, name.length - 1);
    else if(event.keyCode === 20) //Caps Lock
        capsLock = !capsLock;
};

/** Helper Functions */
let validKeyForName = key => {
    if(name.length === 0 && key === " ")
        return false;

    return key.length === 1 && nameRules.test(key);
};

/** Logic */
// let logic = () => {};

let beginGame = () => {
    GAME.p.n = name;
    GAME.n(true);
};

let pressKey = (x, y) => {
    let target = {
        x: Math.floor((x - keyboardPosition.x) / keySize.w),
        y: Math.floor((y - keyboardPosition.y) / keySize.h),
    };

    let keyIndex = target.x + target.y * 10;

    if(keyIndex === 29)
        capsLock = !capsLock;
    else if(keyIndex === 38){
        if(name.length > 0 && name.length < nameMax)
            name += " ";
    }
    else if(keyIndex === 39)
        name = name.slice(0, name.length - 1);
    else if(name.length < nameMax){
        name += capsLock ? keyboard[keyIndex] : keyboard[keyIndex].toLowerCase()
    }
};

/** Draw */
let draw = () => {
    if(creating === false)
        drawNew();
    else
        drawCreate();  
};

let drawNew = () => {
    //Title
    GAME.d.ft("Back To #", GAME.c.w / 2, GAME.c.h / 5, {f: 100});

    //Brief
    let texts = [
        "Welcome to a journey back through time",
        "where some games were corrupted.",
        "Now only a true gamer",
        "can proceed!"
    ];
    GAME.d.ftb(texts, GAME.c.w / 2, GAME.c.h * 2 / 5, 70);

    //Start Button
    GAME.d.db(startButton, "Start Game");
};

let drawCreate = () => {
    //Call
    let texts = [
        "May I know your name,",
        "Traveler?"
    ];
    GAME.d.ftb(texts, GAME.c.w / 2, GAME.c.h / 10, 70);

    //Input
    GAME.d.fr(GAME.c.w/ 3, GAME.c.h * 3 / 10, GAME.c.w / 3, 46);
    GAME.d.ft(name, GAME.c.w / 2, GAME.c.h * 3 / 10 + 23, {fs: "#222222"});

    //Keyboard
    drawKeyboard();

    //Send Button
    if(name.length > 0)
        GAME.d.db(startButton, "Time Travel");
};

let drawKeyboard = () => {
    GAME.d.sr(keyboardPosition.x, keyboardPosition.y, keyboardPosition.w, keyboardPosition.h, {ss: "#555555"});

    for(let i = 0; i < keyboard.length; i++){
        let x = keyboardPosition.x + keySize.w / 2 + keySize.w * (i % 10);
        let y = keyboardPosition.y + keySize.h / 2 + keySize.h * Math.floor(i / 10);
        let key = keyboard[i];

        if(!capsLock && i > 9 && !["Caps", "_", "Space", "Del"].includes(key))
            key = key.toLowerCase();

        GAME.d.ft(key, x, y, {f: 25});    
    }
};

/** Lifecycle */
let onStart = () => {
    //UI
    startButton = {
        x: GAME.c.w / 2 - 180,
        y: GAME.c.h * 9 / 10 - 30,
        w: 360,
        h: 60
    };
    keyboardPosition = {
        x: GAME.c.w / 10,
        y: GAME.c.h * 3 / 8 + 50,
        w: GAME.c.w * 4 / 5,
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