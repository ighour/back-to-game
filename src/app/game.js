const {cp, ca} = require("./canvas");
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
    n: "",
    l: 100,
    d: 0
};
let boss = {
    n: "",
    l: 0,
    d: 0
};

/** Timing Config */
let timing = {
    ltu: 0, //last time update was run in ms
    mfps: 60,  //max FPS
    d: 0,    //time between frames in ms
    u: 1000 / 60,    //simulate time per frame
    fps: 60, //current FPS
    fn: 0,   //frames on that second
    lfps: 0,    //last FPS update
};

/** Events */
let getCanvasCoords = (x, y) => {
    let rect = cp.i.getBoundingClientRect();
    return {
        x: x - rect.left,
        y: y - rect.top
    };
};

["click", "mousemove", "mousedown", "mouseup"].forEach(type => {
    cp.i.addEventListener(type, event => {
        let coords = getCanvasCoords(event.clientX, event.clientY);
        events[type].forEach(e => {
            if(coords.x >= e[1].x && coords.x <= e[1].x + e[1].w && coords.y >= e[1].y && coords.y <= e[1].y + e[1].h)
                e[0](event, coords.x, coords.y)
        });
    });
});

[
    ["touchmove", ["mousemove"]],
    ["touchstart", ["mousedow"]],
    ["touchend", ["mouseup", "click"]]

].forEach(type => {
    cp.i.addEventListener(type[0], event => {
        event.preventDefault();
        let touch = event.touches[0];
        type[1].forEach(target => cp.i.dispatchEvent(new MouseEvent(target, {clientX: touch.clientX, clientY: touch.clientY})));
    });
});

document.addEventListener("keydown", event => events.keydown.forEach(e => e[0](event)));

document.addEventListener("contextmenu", event => event.preventDefault());

/** Helper Functions */
let doDamage = (p, damage) => {
    p.l -= damage;

    if(Math.floor(p.l) <= 0){
        setTimeout(() => {
            next(p === player ? false : true);
        }, 3000);

        return true;
    }

    return false;
};

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
    if(timestamp < timing.ltu + (1000 / timing.mfps)){
        animationFrame = requestAnimationFrame(update);
        return;
    }

    //FPS
    if(timestamp > timing.lfps + 1000){
        timing.fps = Math.floor(0.25 * timing.fn + 0.75 * timing.fps);
        timing.lfps = timestamp;
        timing.fn = 0;

        ca.u(timing.fps, timing.mfps);   //Auxiliar Canvas Update
    }
    timing.fn++;

    //Delta
    timing.d += timestamp - timing.ltu,
    timing.ltu = timestamp;

    while(timing.d >= timing.u)
        timing.d -= timing.u;
 
    //Draw
    cp.d.fr(0, 0, cp.i.width, cp.i.height, {fs: "#333333"});
    instances[current].ou();    //onUpdate
    animationFrame = requestAnimationFrame(update);
};

let start = proceed => {
    instances[current].os(proceed); //onStart
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

    if(instances[current].ost)   //onStop
        instances[current].ost();

    current = proceed !== false ? (current + 1) % instances.length : instances.length - 1;

    start(proceed);
};

export const GAME = {
    c: {    //canvas
        x: 0,
        y: 0,
        w: cp.i.width,  //width
        h: cp.i.height,  //height
        p: cp.p //panel
    },
    cu: current, //current
    p: player,  //player
    b: boss,  //boss
    dt: timing.u, //delta
    e: (type, event, x = 0, y = 0, w = cp.i.width, h = cp.i.height) => events[type].push([event, {x, y, w, h}]),  //add event
    d: {    //draw
        l: cp.d.l,
        sl: cp.d.sl,
        ft: cp.d.ft,
        st: cp.d.st,
        ftb: cp.d.ftb,
        fr: cp.d.fr,
        sr: cp.d.sr,
        fc: cp.d.fc,
        sc: cp.d.sc,
        db: cp.UI.b,
        dt: (title, year, intel, startPosition) => cp.UI.t(title, year, boss, intel, startPosition),
        dp: text => cp.UI.p(player, boss, text),
        dap: cp.UI.ap,
        dic: cp.im.c
    },
    f: {    //functions
        dp: damage => doDamage(player, damage ? damage : boss.d),
        db: damage => doDamage(boss, damage ? damage : player.d),
        mag: getMagVector,
        norm: getNormalizedVector
    },
    ds: {   //data structures
        g: Graph
    },
    n: next,
    s: () => {  //start
        if(instances.length === 0)
            return false;

        current = 0;
        start();

        return true;
    },
    a: instance => instances.push(instance) //add instance
};