/** Variables */
let canvas = document.querySelector("#game-canvas"), ctx = canvas.getContext("2d"), animationFrame, current, instances = [];
let events = {
    click: [],
    mouseMove: [],
    mouseDown: [],
    mouseUp: [],
    keyDown: []
};
let ctxStyle = {
    fillStyle: "white",
    strokeStyle: "white",
    font: "50px Arial",
    textAlign: "center",
    textBaseline: "middle"
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

/** Canvas Config */
canvas.width = 1024;
canvas.height = 768;

/** Context Config */
ctx.lineWidth = 2;
ctx.fillStyle = ctxStyle.fillStyle;
ctx.strokeStyle = ctxStyle.strokeStyle;
ctx.font = ctxStyle.font;
ctx.textAlign = ctxStyle.textAlign;
ctx.textBaseline = ctxStyle.textBaseline;

/** Events */
let addClick = event => events.click.push(event);
canvas.addEventListener("click", event => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    events.click.forEach(e => e(event, x, y));
});

let addMouseMove = event => events.mouseMove.push(event);
canvas.addEventListener("mousemove", event => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    events.mouseMove.forEach(e => e(event, x, y));
});

let addMouseDown = event => events.mouseDown.push(event);
canvas.addEventListener("mousedown", event => {
    events.mouseDown.forEach(e => e(event));
});

let addMouseUp = event => events.mouseUp.push(event);
canvas.addEventListener("mouseup", event => {
    events.mouseUp.forEach(e => e(event));
});

let addKeyDown = event => events.keyDown.push(event);
document.addEventListener("keydown", event => {
    events.keyDown.forEach(e => e(event));
});

/** Draw Functions */
let tempStyleAction = (callback, newStyles) => {
    if(newStyles) styles(newStyles);
    callback();
    if(newStyles) styles(ctxStyle);
};

let clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

let styles = ({fillStyle, strokeStyle, font, textAlign, textBaseline}) => {
    if(fillStyle) ctx.fillStyle = fillStyle;
    if(strokeStyle) ctx.strokeStyle = strokeStyle;
    if(font) ctx.font = font;
    if(textAlign) ctx.textAlign = textAlign;
    if(textBaseline) ctx.textBaseline = textBaseline;
};

let line = (x1, y1, x2, y2, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }, styles);
};

let splitLine = (x1, y1, x2, y2, spacing, styles) => {
    tempStyleAction(() => {
        let x = x1;
        let y = y1;

        let spacingX = (x2 - x1) / spacing;
        let spacingY = (y2 - y1) / spacing;

        ctx.beginPath();

        while(x < x2 || y < y2){
            ctx.moveTo(x, y);
            x += spacingX;
            y += spacingY;
            ctx.lineTo(x, y);
            x += spacingX;
            y += spacingY;
        }

        ctx.stroke();
    }, styles);
};

let drawText = (type, text, x, y, styles) => {
    tempStyleAction(() => ctx[type](text, x, y), styles);
};
let fillText = (text, x, y, styles) => drawText("fillText", text, x, y, styles);
let strokeText = (text, x, y, styles) => drawText("strokeText", text, x, y, styles);

let fillTextBlock = (texts, x, y, spacing, styles) => {
    tempStyleAction(() => {
        for(let i = 0; i < texts.length; i++)
            ctx.fillText(texts[i], x, y + spacing*i);
    }, styles);
};

let drawRect = (type, x, y, width, height, styles) => {
    tempStyleAction(() => ctx[type](x, y, width, height), styles);
};
let fillRect = (x, y, width, height, styles) => drawRect("fillRect", x, y, width, height, styles);
let strokeRect = (x, y, width, height, styles) => drawRect("strokeRect", x, y, width, height, styles);

let drawCircle = (type, x, y, radius, startAngle = 0, endAngle = 2*Math.PI, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx[type]();
    }, styles);
};
let fillCircle = (x, y, radius, startAngle, endAngle, styles) => drawCircle("fill", x, y, radius, startAngle, endAngle, styles);
let strokeCircle = (x, y, radius, startAngle, endAngle, styles) => drawCircle("stroke", x, y, radius, startAngle, endAngle, styles);

/** Helper Functions */
let doDamage = (player, damage) => {
    player.life -= damage;

    if(player.life <= 0){
        setTimeout(() => {
            MAIN.next(player === MAIN.player ? false : true);
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

        auxUpdate();
    }
    timing.framesNow++;

    //Delta
    timing.delta += timestamp - timing.lastTimeUpdate,
    timing.lastTimeUpdate = timestamp;

    while(timing.delta >= timing.unit)
        timing.delta -= timing.unit;
 
    //Draw
    clearCanvas();
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

const MAIN = {
    canvas: {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height
    },
    player: {
        name: "",
        life: 100,
        damage: 25
    },
    events: {
        addClick,
        addMouseMove,
        addMouseDown,
        addMouseUp,
        addKeyDown
    },
    draw: {
        styles,
        line,
        splitLine,
        fillText,
        strokeText,
        fillTextBlock,
        fillRect,
        strokeRect,
        fillCircle,
        strokeCircle
    },
    functions: {
        doDamage
    },
    delta: timing.unit,
    FPS: timing.FPS,
    current,
    add: game => instances.push(game),
    next: proceed => {
        stop();

        if(instances[current].onStop)
            instances[current].onStop();

        let lastIndex = instances.length - 1;

        current = proceed !== false ? (current === lastIndex ? 0 : current + 1) : lastIndex;

        start(proceed);
    },
    start: () => {
        if(instances.length === 0)
            return false;

        current = 0;
        start();

        return true;
    }
};

/** Aux Canvas */
let auxCanvas = document.querySelector("#game-aux"), auxCtx = auxCanvas.getContext("2d");
auxCanvas.width = canvas.width;
auxCanvas.height = 50;
auxCtx.lineWidth = 2;
auxCtx.font = "20px Arial";
auxCtx.textAlign = "left";
auxCtx.textBaseline = "center";
auxCtx.fillStyle = "lightgrey";

auxCtx.fillText("Back To #", 0, auxCanvas.height / 2);

auxCtx.textAlign = "right";

let auxUpdate = () => {
    auxCtx.clearRect(auxCanvas.width / 2, 0, auxCanvas.width / 2, auxCanvas.height);
    auxCtx.fillStyle = timing.FPS < timing.maxFPS / 2 ? "red" : "lightgrey";
    auxCtx.fillText(`${timing.FPS} FPS`, auxCanvas.width, auxCanvas.height / 2);
};

export default MAIN;