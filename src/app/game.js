const c = require("./canvas");
const canvas = c.primary
const auxCanvas = c.secondary;
const { Graph } = require("./datastructures");

/** Variables */
let animationFrame, instances = [], current;
let events = {
    click: [],
    mousemove: [],
    mousedown: [],
    mouseup: [],
    keydown: []
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

let eventCanRun = (coords, target) => coords.x >= target.x && coords.x <= target.x + target.width && coords.y >= target.y && coords.y <= target.y + target.height;

let addEvent = (type, event, x = 0, y = 0, width = canvas.instance.width, height = canvas.instance.height) => events[type].push([event, {x, y, width, height}]);

["click", "mousemove", "mousedown", "mouseup"].forEach(type => {
    canvas.instance.addEventListener(type, event => {
        let coords = getCanvasCoords(event.clientX, event.clientY);
        events[type].forEach(e => {if(eventCanRun(coords, e[1])) e[0](event, coords.x, coords.y)});
    });
});

[
    ["touchmove", ["mousemove"]],
    ["touchstart", ["mousedow"]],
    ["touchend", ["mouseup", "click"]]

].forEach(type => {
    canvas.instance.addEventListener(type[0], event => {
        event.preventDefault();
        let touch = event.touches[0];
        let coords = getCanvasCoords(touch.clientX, touch.clientY);
        type[1].forEach(target => canvas.instance.dispatchEvent(new MouseEvent(target, {clientX: coords.clientX, clientY: coords.clientY})));
    });
});

document.addEventListener("keydown", event => events.keydown.forEach(e => e[0](event)));

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
let doDamagePlayer = damage => doDamage(player, damage ? damage : boss.damage);
let doDamageBoss = damage => doDamage(boss, damage ? damage : player.damage);

let getMagVector = (x, y) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

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
    events.click = [];
    events.mousemove = [];
    events.mousedown = [];
    events.mouseup = [];
    events.keydown = [];
};

let next = proceed => {
    stop();

    if(instances[current].onStop)
        instances[current].onStop();

    current = proceed !== false ? (current + 1) % instances.length : instances.length - 1;

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
    addEvent,
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
        drawButton: canvas.UI.drawButton,
        drawTutorial: (title, year, intel, startPosition) => canvas.UI.drawTutorial(title, year, boss, intel, startPosition),
        drawGameOver: () => canvas.UI.drawGameOver(player, boss),
        drawPanel: () => canvas.UI.drawPanel(player, boss),
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