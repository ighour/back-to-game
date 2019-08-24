const { drawTutorial, drawPanel } = require("./draw/UI");
const { drawButton, drawArrowPointer } = require("./draw/components");

/** Canvas Config */
let canvas = document.querySelector("#gc"), ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;

/** Panel */
let p = {
    x: 0,
    y: canvas.height - 150,
    w: canvas.width,
    h: 150
};
let panelCenter = {
    x: p.x + p.w / 2,
    y: p.y + p.h / 2
};

/** Context Config */
let defaultCtx = {
    lw: 2,
    fs: "white",
    ss: "white",
    f: 50,
    ta: "c",
    tb: "m",
};
let defaultCtxTA = {
    s: "start",
    e: "end",
    l: "left",
    c: "center",
    r: "right"
};
let defaultCtxTB = {
    t: "top",
    b: "bottom",
    m: "middle",
    a: "alphabetic",
    h: "hanging"
};
ctx.lineWidth = defaultCtx.lw;
ctx.fillStyle = defaultCtx.fs;
ctx.strokeStyle = defaultCtx.ss;
ctx.font = `${defaultCtx.f}px Arial`;
ctx.textAlign = defaultCtxTA[defaultCtx.ta];
ctx.textBaseline = defaultCtxTB[defaultCtx.tb];

/** Draw Functions */
let d = {};

let tempStyleAction = (callback, newStyles) => {
    if(newStyles) styles(newStyles);
    callback();
    if(newStyles) styles(defaultCtx);
};

let styles = ({fs, ss, f, ta, tb, lw}) => {
    if(lw) ctx.lineWidth = lw;
    if(fs) ctx.fillStyle = fs;
    if(ss) ctx.strokeStyle = ss;
    if(f) ctx.font = `${f}px Arial`;
    if(ta) ctx.textAlign = defaultCtxTA[ta];
    if(tb) ctx.textBaseline = defaultCtxTB[tb];
};

//Clear Canvas
d.cc = (x, y, w, h) => ctx.clearRect(x, y, w, h);

//Line
d.l = (x1, y1, x2, y2, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }, styles);
};

//Split Line
d.sl = (x1, y1, x2, y2, spacing, styles) => {
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

let drawText = (type, text, x, y, styles) => tempStyleAction(() => ctx[type](text, x, y), styles);
//Fill Text
d.ft = (text, x, y, styles) => drawText("fillText", text, x, y, styles);
//Stroke Text
d.st = (text, x, y, styles) => drawText("strokeText", text, x, y, styles);

//Fill Text Block
d.ftb = (texts, x, y, spacing, styles) => {
    tempStyleAction(() => {
        for(let i = 0; i < texts.length; i++)
            ctx.fillText(texts[i], x, y + spacing*i);
    }, styles);
};

let drawRect = (type, x, y, width, height, styles) => tempStyleAction(() => ctx[type](x, y, width, height), styles);
//Fill Rect
d.fr = (x, y, width, height, styles) => drawRect("fillRect", x, y, width, height, styles);
//Stroke Rect
d.sr = (x, y, width, height, styles) => drawRect("strokeRect", x, y, width, height, styles);

let drawCircle = (type, x, y, radius, startAngle = 0, endAngle = 2*Math.PI, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx[type]();
    }, styles);
};
//Fill Circle
d.fc = (x, y, radius, startAngle, endAngle, styles) => drawCircle("fill", x, y, radius, startAngle, endAngle, styles);
//Stroke Circle
d.sc = (x, y, radius, startAngle, endAngle, styles) => drawCircle("stroke", x, y, radius, startAngle, endAngle, styles);

export const cp = {
    i: canvas,  //instance
    p,  //panel 
    d,  //draw
    UI: {
        b: (position, text, styles) => drawButton(d, position, text, styles),
        t: (title, year, boss, intel, startPosition) => drawTutorial(d, canvas.width, canvas.height, title, year, boss, intel, startPosition),
        p: (player, boss, text) => drawPanel(d, p, player, boss, text),
        ap: (dirX, dirY, active, position = panelCenter) => drawArrowPointer(d, dirX, dirY, position, active),
    }
};

/** Variables */
let auxCanvas = document.querySelector("#ga"), auxCtx = auxCanvas.getContext("2d");

/** Canvas Config */
let w = canvas.width, h = 50;
auxCanvas.width = w;
auxCanvas.height = h;

/** Context Config */
auxCtx.font = "20px Arial";
auxCtx.textAlign = "left";
auxCtx.textBaseline = "center";
auxCtx.fillStyle = "lightgrey";

/** Fixed Draw */
auxCtx.fillText("Back To #", 0, h / 2);

auxCtx.textAlign = "right";

/** Update */
let update = (FPS, maxFPS) => {
    auxCtx.clearRect(w / 2, 0, w / 2, h);
    auxCtx.fillStyle = FPS < maxFPS / 2 ? "red" : "lightgrey";
    auxCtx.fillText(`${FPS} FPS`, w, h / 2);
};

export const ca = {
    i: auxCanvas,   //instance
    u: update   //update canvas
};