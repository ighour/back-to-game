const { GAME } = require('../game');

/** Variables */
let acceptButton, travelButton, travelButton2, keyboardPosition, keySize, capsLock, creating, name, keyboard, nameMax, nameRules, textTimer;

/** Helper Functions */

/** Logic */
// let logic = () => {};

/** Draw */
let draw = () => {
    if(creating === false){
        textTimer += GAME.dt;

        let sp = 70, tm = 50;

        GAME.d.dt(1,
            ["Back To Game"],
            [
                [
                    {c: "The year is 2019.", sp, tm},
        
                    {c: "Chess is angry with technology because people prefer digital games.", sp, tm},
        
                    {c: "He believes that he would be an important game again if he could reach", sp: sp / 1.8, tm},
                    {c: "the most famous and classic digital games of history.", sp, tm},
        
                    {c: "So he has decided to create an improved and digital version of chess and", sp: sp / 1.8, tm},
                    {c: "send it back in time to corrupt those games.", sp, tm},
        
                    {c: "The gaming world now has only one hope, a traveler able to rescue all", sp: sp / 1.8, tm},
                    {c: "corrupted games and destroy the Evil Chess.", sp: sp * 1.1, tm},
        
                    {c: "Do you accept this mission?", sp, tm, s: {ta: "c"}, x: GAME.c.x + GAME.c.w / 2},
                ]
            ],
            textTimer,
            [acceptButton],
            ["Accept"]
        );
    }

    else{
        let x = GAME.c.x + GAME.c.w / 2, y = GAME.c.y;

        //Call
        GAME.d.ft("May I know your name,", x, y + 70);
        GAME.d.ft("Traveler?", x, y + 140);

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
        if(name.length > 0){
            let fs = "red";
            GAME.d.db(travelButton, "Epic Travel", {fs, ss: fs});
            GAME.d.ft("Score Boost", travelButton.x + travelButton.w / 2, travelButton.y + 80, {fs, f: 20});

            fs = "green";
            GAME.d.db(travelButton2, "Fun Travel", {fs, ss: fs});
            GAME.d.ft("HP Regen | ATK Boost | DEF Boost", travelButton2.x + travelButton2.w / 2, travelButton2.y + 80, {fs, f: 20});
        }
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
        x: x - 400,
        y: y * 2 - 120,
        w: 280,
        h: 60
    };
    travelButton2 = {
        x: x + 120,
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
    let clickTravel = (mode) => {
        if(creating && name.length > 0){
            GAME.p.n = name;
            GAME.p.m = mode;
            GAME.n(true);
        }
    };

    GAME.e("click", () => {
        if(creating == false && textTimer >= 1000)
            creating = true;
    }, acceptButton);

    GAME.e("click", () => clickTravel(1), travelButton);
    GAME.e("click", () => clickTravel(1.2), travelButton2);

    GAME.e("click", (event, x, y) => {
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
    }, keyboardPosition);

    GAME.e("keydown", (event) => {
        if(!creating)
            return;
            
        if(name.length < nameMax && event.key.length === 1 && nameRules.test(event.key))
            name += event.key;
        else if(event.keyCode === 8) //Backspace
            name = name.slice(0, name.length - 1);
        else if(event.keyCode === 20) //Caps Lock
            capsLock = !capsLock;
    });
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