const {cp, ca} = require("./canvas");
const { Graph } = require("./datastructures");

/** Variables */
let animationFrame, instances = [], currentInstance = 0, lastInstance = 0;
let events = {
    click: [],
    mousemove: [],
    mousedown: [],
    mouseup: [],
    keydown: []
};

/** Players Config */
let player = {
    n: "",  //name
    l: 100, //life
    d: 0,   //damage
    s: [],   //score
    m: 0    //difficulty (1 = hard, 1.2 = easy)
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
        let touch = event.touches.length > 0 ? event.touches[0] : event.changedTouches[0];
        type[1].forEach(target => cp.i.dispatchEvent(new MouseEvent(target, {clientX: touch.clientX, clientY: touch.clientY})));
    });
});

document.addEventListener("keydown", event => events.keydown.forEach(e => e[0](event)));

document.addEventListener("contextmenu", event => event.preventDefault());

/** Monetize */
let monetize = {
    a: false,    //web monetization existence
    s: false    //web monetization started
};
let checkMonetizing = () => {
    monetize.a = document.monetization;
    monetize.s = monetize.a && document.monetization.state === 'started';
    if(currentInstance == instances.length - 1){
        ca.t(monetize.s ? "Thank you for supporting us with your Coil subscription!" : "You can enable Revive and help us by clicking at Support Us and subscribing to a Coil account.");
    }
    setTimeout(checkMonetizing, 5000);
};
checkMonetizing();

/** Helper Functions */
let doDamage = (p, damage, score) => {
    p.l -= damage;

    if(score)
        p.s[currentInstance] += score;

    if(Math.floor(p.l) <= 0){
        if(p === player)
            p.s[currentInstance] = 0;

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
    cp.d.fr(0, 0, cp.i.width, cp.i.height, {fs: "#2A293E"});
    instances[currentInstance].ou();    //onUpdate
    animationFrame = requestAnimationFrame(update);
};

let start = proceed => {
    instances[currentInstance].os(proceed); //onStart
    update(0);
};

let stop = () => {
    cancelAnimationFrame(animationFrame);
    events.click = [];
    events.mousemove = [];
    events.mousedown = [];
    events.mouseup = [];
    events.keydown = [];
    ca.t("");

    if(player.s[currentInstance] && player.s[currentInstance] < 0)
        player.s[currentInstance] = 0;
};

let next = (proceed, toLastInstance) => {
    stop();

    if(instances[currentInstance].ost)   //onStop
        instances[currentInstance].ost();

    lastInstance = currentInstance;

    if(toLastInstance !== undefined)
        currentInstance = toLastInstance;
    else 
        currentInstance = proceed !== false ? (currentInstance + 1) % instances.length : instances.length - 1;

    if(player.m != 1)
        player.l = player.l + 10 > 100 ? 100 : player.l + 10;

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
    ca: {
        t: ca.t
    },
    cu: () => currentInstance, //current
    p: player,  //player
    b: boss,  //boss
    dt: timing.u, //delta
    m: monetize,    //web monetizing
    e: (type, event, coords = {x: 0, y: 0, w: cp.i.width, h: cp.i.height}) => events[type].push([event, coords]),  //add event
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
        dtx: cp.UI.tx,
        db: cp.UI.b,
        dt: cp.UI.t,
        dp: text => cp.UI.p(player, boss, text),
        dap: cp.UI.ap,
        dic: cp.im.c,
        dio: (name, x, y, fs, notFs = "#2A293E", size) => cp.im.o(name, x, y, fs, notFs, size)
    },
    f: {    //functions
        dp: (damage, score) => doDamage(player, damage ? damage : boss.d, score),
        db: (damage, score) => doDamage(boss, damage ? damage : player.d, score),
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

        start();

        return true;
    },
    a: instance => instances.push(instance), //add instance
    r: () => {  //revive
        player.l = 100;
        next(undefined, lastInstance);
    }
};