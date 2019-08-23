const { drawButton, drawTutorial, drawPanel, drawMouseDirection } = require("./draw/UI");

/** Canvas Config */
let canvas = document.querySelector("#game-canvas"), ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;

/** Panel */
let panelPosition = {
    x: 0,
    y: canvas.height - 100,
    width: canvas.width,
    height: 100
};

/** Context Config */
let defaultCtx = {
    fillStyle: "white",
    strokeStyle: "white",
    font: "50px Arial",
    textAlign: "center",
    textBaseline: "middle",
};
ctx.lineWidth = defaultCtx.lineWidth;
ctx.fillStyle = defaultCtx.fillStyle;
ctx.strokeStyle = defaultCtx.strokeStyle;
ctx.font = defaultCtx.font;
ctx.textAlign = defaultCtx.textAlign;
ctx.textBaseline = defaultCtx.textBaseline;

/** Draw Functions */
let draw = {};

let tempStyleAction = (callback, newStyles) => {
    if(newStyles) styles(newStyles);
    callback();
    if(newStyles) styles(defaultCtx);
};

let styles = ({fillStyle, strokeStyle, font, textAlign, textBaseline}) => {
    if(fillStyle) ctx.fillStyle = fillStyle;
    if(strokeStyle) ctx.strokeStyle = strokeStyle;
    if(font) ctx.font = font;
    if(textAlign) ctx.textAlign = textAlign;
    if(textBaseline) ctx.textBaseline = textBaseline;
};

draw.clearCanvas = (x, y, width, height) => ctx.clearRect(x, y, width, height);

draw.line = ( x1, y1, x2, y2, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }, styles);
};

draw.splitLine = ( x1, y1, x2, y2, spacing, styles) => {
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
draw.fillText = (text, x, y, styles) => drawText("fillText", text, x, y, styles);
draw.strokeText = (text, x, y, styles) => drawText("strokeText", text, x, y, styles);

draw.fillTextBlock = (texts, x, y, spacing, styles) => {
    tempStyleAction(() => {
        for(let i = 0; i < texts.length; i++)
            ctx.fillText(texts[i], x, y + spacing*i);
    }, styles);
};

let drawRect = (type, x, y, width, height, styles) => {
    tempStyleAction(() => ctx[type](x, y, width, height), styles);
};
draw.fillRect = (x, y, width, height, styles) => drawRect("fillRect", x, y, width, height, styles);
draw.strokeRect = (x, y, width, height, styles) => drawRect("strokeRect", x, y, width, height, styles);

let drawCircle = (type, x, y, radius, startAngle = 0, endAngle = 2*Math.PI, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx[type]();
    }, styles);
};
draw.fillCircle = (x, y, radius, startAngle, endAngle, styles) => drawCircle("fill", x, y, radius, startAngle, endAngle, styles);
draw.strokeCircle = (x, y, radius, startAngle, endAngle, styles) => drawCircle("stroke", x, y, radius, startAngle, endAngle, styles);

export const primary = {
    instance: canvas,
    panelPosition,
    draw,
    UI: {
        drawButton: (position, text, styles) => drawButton(draw, position, text, styles),
        drawTutorial: (title, year, boss, intel, startPosition) => drawTutorial(draw, canvas.width, canvas.height, title, year, boss, intel, startPosition),
        drawPanel: (player, boss, text) => drawPanel(draw, panelPosition, player, boss, text),
        drawMouseDirection: (x, y) => drawMouseDirection(draw, panelPosition, x, y),
    }
};

/** Variables */
let auxCanvas = document.querySelector("#game-aux"), auxCtx = canvas.getContext("2d");

/** Canvas Config */
auxCanvas.width = canvas.width;
auxCanvas.height = 50;

/** Context Config */
auxCtx.lineWidth = 2;
auxCtx.font = "20px Arial";
auxCtx.textAlign = "left";
auxCtx.textBaseline = "center";
auxCtx.fillStyle = "lightgrey";

/** Fixed Draw */
auxCtx.fillText("Back To #", 0, auxCanvas.height / 2);

auxCtx.textAlign = "right";

/** Update */
let update = (FPS, maxFPS) => {
    auxCtx.clearRect(auxCanvas.width / 2, 0, auxCanvas.width / 2, auxCanvas.height);
    auxCtx.fillStyle = FPS < maxFPS / 2 ? "red" : "lightgrey";
    auxCtx.fillText(`${FPS} FPS`, auxCanvas.width, auxCanvas.height / 2);
};

export const secondary = {
    instance: auxCanvas,
    update
};