const canvas = require("./canvas/primary").default;
const auxCanvas = require("./canvas/secondary").default;
const events = require("./events").default;
const { getMagVector, getNormalizedVector } = require("./utils");
const { Graph } = require("./datastructures");

/** Variables */
let animationFrame, instances = [], current;

/** Player Config */
let player = {
    name: "",
    life: 100,
    damage: 25
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
    events.clearEvents();
};

let next = proceed => {
    stop();

    if(instances[current].onStop)
        instances[current].onStop();

    let lastIndex = instances.length - 1;

    current = proceed !== false ? (current === lastIndex ? 0 : current + 1) : lastIndex;

    start(proceed);
};

/** Events */
events.addClickEventListener(canvas.instance);
events.addMouseMoveEventListener(canvas.instance);
events.addMouseDownEventListener(canvas.instance);
events.addMouseUpEventListener(canvas.instance);
events.addTouchMoveEventListener(canvas.instance);
events.addTouchStartEventListener(canvas.instance);
events.addTouchEndEventListener(canvas.instance);
events.addKeyDownEventListener(document);
events.addContextMenuEventListener(document);

export default {
    canvas: {
        x: canvas.instance.x,
        y: canvas.instance.y,
        width: canvas.instance.width,
        height: canvas.instance.height
    },
    current,
    player,
    delta: timing.unit,
    events: {
        addClick: e => events.addClick(e),
        addMouseMove: e => events.addMouseMove(e),
        addMouseDown: e => events.addMouseDown(e),
        addMouseUp: e => events.addMouseUp(e),
        addKeyDown: e => events.addKeyDown(e),
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
        // styles,
        drawTutorial: canvas.UI.drawTutorial,
        drawGameOver: (panelPosition, boss) => canvas.UI.drawGameOver(panelPosition, player, boss),
        drawPlayerPanel: (panelPosition, boss) => canvas.UI.drawPlayerPanel(panelPosition, player, boss),
        drawMouseDirection: canvas.UI.drawMouseDirection,
    },
    functions: {
        doDamage,
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