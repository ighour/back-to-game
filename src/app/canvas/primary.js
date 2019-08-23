const draw = require("./helpers").default;
const { drawTutorial, drawGameOver, drawPlayerPanel, drawMouseDirection } = require("./UI");

/** Variables */
let canvas = document.querySelector("#game-canvas"), ctx = canvas.getContext("2d");

/** Canvas Config */
canvas.width = 1024;
canvas.height = 768;

/** Context Config */
ctx.lineWidth = 2;
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.font = "50px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

export default {
    instance: canvas,
    draw: {
        clearCanvas: (x, y, width, height) => draw.clearCanvas(ctx, x, y, width, height),
        line: (x1, y1, x2, y2, styles) => draw.line(ctx, x1, y1, x2, y2, styles),
        splitLine: (x1, y1, x2, y2, spacing, styles) => draw.splitLine(ctx, x1, y1, x2, y2, spacing, styles),
        fillText: (text, x, y, styles) => draw.fillText(ctx, text, x, y, styles),
        strokeText: (text, x, y, styles) => draw.strokeText(ctx, text, x, y, styles),
        fillTextBlock: (texts, x, y, spacing, styles) => draw.fillTextBlock(ctx, texts, x, y, spacing, styles),
        fillRect: (x, y, width, height, styles) => draw.fillRect(ctx, x, y, width, height, styles),
        strokeRect: (x, y, width, height, styles) => draw.strokeRect(ctx, x, y, width, height, styles),
        fillCircle: (x, y, radius, startAngle, endAngle, styles) => draw.fillCircle(ctx, x, y, radius, startAngle, endAngle, styles),
        strokeCircle: (x, y, radius, startAngle, endAngle, styles) => draw.strokeCircle(ctx, x, y, radius, startAngle, endAngle, styles),
    },
    UI: {
        drawTutorial: (title, year, boss, intel, startPosition) => drawTutorial(ctx, canvas.width, canvas.height, title, year, boss, intel, startPosition),
        drawGameOver: (panelPosition, player, boss) => drawGameOver(ctx, panelPosition, player, boss),
        drawPlayerPanel: (panelPosition, player, boss) => drawPlayerPanel(ctx, panelPosition, player, boss),
        drawMouseDirection: (panelPosition, x, y) => drawMouseDirection(ctx, panelPosition, x, y),
    }
};