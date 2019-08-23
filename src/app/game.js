const c = require("./canvas");
const canvas = c.primary
const auxCanvas = c.secondary;
const { Graph } = require("./datastructures");

/** Variables */
let animationFrame, instances = [], current;
let events = {
    click: [],
    mouseMove: [],
    mouseDown: [],
    mouseUp: [],
    keyDown: []
};

/** Players Config */
let player = {
    name: "",
    life: 100,
    damage: 0
};
let boss = {
    name: "",
    life: 0,
    damage: 0
};

/** Timing Config */
let timing = {
    lastTimeUpdate: 0, //last time update was run in ms
    maxFPS: 60,  //max FPS
    delta: 0,    //time between frames in ms
    unit: 1000 / 60,    //simulate time per frame
    FPS: 60, //current FPS
    framesNow: 0,   //frames on that second
    lastFPS: 0,    //last FPS update
};

/** Events */
let getCanvasCoords = (x, y) => {
    let rect = canvas.instance.getBoundingClientRect();
    return {
        x: x - rect.left,
        y: y - rect.top
    };
};

let addClick = event => events.click.push(event);
canvas.instance.addEventListener("click", event => {
    let coords = getCanvasCoords(event.clientX, event.clientY);
    events.click.forEach(e => e(event, coords.x, coords.y));
});

let addMouseMove = event => events.mouseMove.push(event);
canvas.instance.addEventListener("mousemove", event => {
    let coords = getCanvasCoords(event.clientX, event.clientY);
    events.mouseMove.forEach(e => e(event, coords.x, coords.y));
});

let addMouseDown = event => events.mouseDown.push(event);
canvas.instance.addEventListener("mousedown", event => events.mouseDown.forEach(e => e(event)));

let addMouseUp = event => events.mouseUp.push(event);
canvas.instance.addEventListener("mouseup", event => events.mouseUp.forEach(e => e(event)));

canvas.instance.addEventListener("touchmove", event => {
    event.preventDefault();
    let touch = event.touches[0];
    canvas.instance.dispatchEvent(new MouseEvent("mousemove", {clientX: touch.clientX, clientY: touch.clientY}));
});

canvas.instance.addEventListener("touchstart", event => {
    event.preventDefault();
    let touch = event.touches[0];
    let coords = getCanvasCoords(touch.clientX, touch.clientY);
    canvas.instance.dispatchEvent(new MouseEvent("mousedown", {clientX: coords.x, clientY: coords.y}));
});

canvas.instance.addEventListener("touchend", event => {
    event.preventDefault();

    let touch = event.changedTouches[0];
    let coords = getCanvasCoords(touch.clientX, touch.clientY);

    canvas.instance.dispatchEvent(new MouseEvent("mouseup", {clientX: coords.x, clientY: coords.y}));
    canvas.instance.dispatchEvent(new MouseEvent("click", {clientX: coords.x, clientY: coords.y}));    
});

let addKeyDown = event => events.keyDown.push(event);
document.addEventListener("keydown", event => {
    events.keyDown.forEach(e => e(event));
});

document.addEventListener("contextmenu", event => event.preventDefault());

/** Helper Functions */
let doDamage = (p, damage) => {
    p.life -= damage;

    if(Math.floor(p.life) <= 0){
        setTimeout(() => {
            next(p === player ? false : true);
        }, 3000);

        return true;
    }

    return false;
};
let doDamagePlayer = damage => {
    return doDamage(player, damage ? damage : boss.damage);
};
let doDamageBoss = damage => {
    return doDamage(boss, damage ? damage : player.damage);
};

let getMagVector = (x, y) => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

let getNormalizedVector = (x, y, mag) => {
    if(!mag)
        mag = getMagVector(x, y);

    if(mag === 0)
        return {x: 0, y: 0};

    return {
        x: x / mag,
        y: y / mag
    };
};

/** Game Functions */
let update = timestamp => {
    //Frame rate limit
    if(timestamp < timing.lastTimeUpdate + (1000 / timing.maxFPS)){
        animationFrame = requestAnimationFrame(update);
        return;
    }

    //FPS
    if(timestamp > timing.lastFPS + 1000){
        timing.FPS = Math.floor(0.25 * timing.framesNow + 0.75 * timing.FPS);
        timing.lastFPS = timestamp;
        timing.framesNow = 0;

        auxCanvas.update(timing.FPS, timing.maxFPS);
    }
    timing.framesNow++;

    //Delta
    timing.delta += timestamp - timing.lastTimeUpdate,
    timing.lastTimeUpdate = timestamp;

    while(timing.delta >= timing.unit)
        timing.delta -= timing.unit;
 
    //Draw
    canvas.draw.clearCanvas(0, 0, canvas.instance.width, canvas.instance.height);
    instances[current].onUpdate();
    animationFrame = requestAnimationFrame(update);
};

let start = proceed => {
    instances[current].onStart(proceed);
    update(0);
};

let stop = () => {
    cancelAnimationFrame(animationFrame);
    events = {
        click: [],
        mouseMove: [],
        mouseDown: [],
        mouseUp: [],
        keyDown: []
    };
};

let next = proceed => {
    stop();

    if(instances[current].onStop)
        instances[current].onStop();

    let lastIndex = instances.length - 1;

    current = proceed !== false ? (current === lastIndex ? 0 : current + 1) : lastIndex;

    start(proceed);
};

export default {
    canvas: {
        x: canvas.instance.x,
        y: canvas.instance.y,
        width: canvas.instance.width,
        height: canvas.instance.height,
        panelPosition: canvas.panelPosition
    },
    current,
    player,
    boss,
    delta: timing.unit,
    events: {
        addClick,
        addMouseMove,
        addMouseDown,
        addMouseUp,
        addKeyDown,
    },
    draw: {
        line: canvas.draw.line,
        splitLine: canvas.draw.splitLine,
        fillText: canvas.draw.fillText,
        strokeText: canvas.draw.strokeText,
        fillTextBlock: canvas.draw.fillTextBlock,
        fillRect: canvas.draw.fillRect,
        strokeRect: canvas.draw.strokeRect,
        fillCircle: canvas.draw.fillCircle,
        strokeCircle: canvas.draw.strokeCircle,
        drawTutorial: canvas.UI.drawTutorial,
        drawGameOver: () => canvas.UI.drawGameOver(player, boss),
        drawPlayerPanel: () => canvas.UI.drawPlayerPanel(player, boss),
        drawMouseDirection: canvas.UI.drawMouseDirection,
    },
    functions: {
        doDamagePlayer,
        doDamageBoss,
        getMagVector,
        getNormalizedVector
    },
    dataStructures: {
        graph: Graph
    },
    next,
    start: () => {
        if(instances.length === 0)
            return false;

        current = 0;
        start();

        return true;
    },
    add: instance => instances.push(instance)
};