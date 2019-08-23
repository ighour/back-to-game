const GAME = require('../game').default;

/** Variables */
let startButton, keyboardPosition, keySize, capsLock;
let creating, name, keyboard, nameRules;

/** Helper Functions */
let validKeyForName = key => {
    if(name.length === 0 && key === " ")
        return false;

    return key.length === 1 && nameRules.keys.test(key);
};

/** State Functions */
let beginGame = () => {
    GAME.player.name = name;
    GAME.next(true);
};

let pressKey = (x, y) => {
    let target = {
        x: Math.floor((x - keyboardPosition.x) / keySize.width),
        y: Math.floor((y - keyboardPosition.y) / keySize.height),
    };

    let keyIndex = target.x + target.y * 10;

    if(keyIndex === 29)
        capsLock = !capsLock;
    else if(keyIndex === 38){
        if(name.length > 0 && name.length < nameRules.max)
            name += " ";
    }
    else if(keyIndex === 39)
        name = name.slice(0, name.length - 1);
    else if(name.length < nameRules.max){
        name += capsLock ? keyboard[keyIndex] : keyboard[keyIndex].toLowerCase()
    }
};

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

    //Start Button
    GAME.draw.drawButton(startButton, "Start Game");
};

let drawCreate = () => {
    //Call
    let texts = [
        "May I know your name,",
        "Traveler?"
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 2, GAME.canvas.height / 10, 70);

    //Input
    GAME.draw.fillRect(GAME.canvas.width/ 3, GAME.canvas.height * 3 / 10, GAME.canvas.width / 3, 46);
    GAME.draw.fillText(name, GAME.canvas.width / 2, GAME.canvas.height * 3 / 10 + 23, {fillStyle: "#222222"});

    //Keyboard
    drawKeyboard();

    //Send Button
    if(name.length > 0)
        GAME.draw.drawButton(startButton, "Time Travel");
};

let drawKeyboard = () => {
    GAME.draw.strokeRect(keyboardPosition.x, keyboardPosition.y, keyboardPosition.width, keyboardPosition.height, {strokeStyle: "#555555"});

    for(let i = 0; i < keyboard.length; i++){
        let x = keyboardPosition.x + keySize.width / 2 + keySize.width * (i % 10);
        let y = keyboardPosition.y + keySize.height / 2 + keySize.height * Math.floor(i / 10);
        let key = keyboard[i];

        if(!capsLock && i > 9 && !["Caps", "_", "Space", "Del"].includes(key))
            key = key.toLowerCase();

        GAME.draw.fillText(key, x, y, {font: "25px Arial"});    
    }
};

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

    if(validKeyForName(key) && name.length < nameRules.max)
        name += key;
    else if(event.keyCode === 8) //Backspace
        name = name.slice(0, name.length - 1);
    else if(event.keyCode === 20) //Caps Lock
        capsLock = !capsLock;
};

/** Lifecycle */
let onStart = () => {
    //UI
    startButton = {
        x: GAME.canvas.width / 2 - 180,
        y: GAME.canvas.height * 9 / 10 - 30,
        width: 360,
        height: 60
    };
    keyboardPosition = {
        x: GAME.canvas.width / 10,
        y: GAME.canvas.height * 3 / 8 + 50,
        width: GAME.canvas.width * 4 / 5,
        height: GAME.canvas.height / 3
    };
    keySize = {
        width: keyboardPosition.width / 10,
        height: keyboardPosition.height / 4
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
    nameRules = {
        max: 8,
        keys: /[a-zA-Z0-9_ ]/
    };

    //Engine
    GAME.addEvent("click", clickStart, startButton.x, startButton.y, startButton.width, startButton.height);
    GAME.addEvent("click", clickKeyboard, keyboardPosition.x, keyboardPosition.y, keyboardPosition.width, keyboardPosition.height);
    GAME.addEvent("keydown", keyDown);
};

let onUpdate = () => {  
    if(creating === false)
        drawNew();
    else
        drawCreate();  
};

// let onReset = () => {

// };

// let onStop = () => {
    
// };

export default {onStart, onUpdate};