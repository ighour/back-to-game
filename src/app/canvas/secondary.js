const draw = require("./helpers").default;

/** Variables */
let canvas = document.querySelector("#game-aux"), ctx = canvas.getContext("2d");

/** Canvas Config */
canvas.width = 1024;
canvas.height = 50;

/** Context Config */
ctx.lineWidth = 2;
ctx.font = "20px Arial";
ctx.textAlign = "left";
ctx.textBaseline = "center";
ctx.fillStyle = "lightgrey";

/** Fixed Draw */
draw.fillText(ctx, "Back To #", 0, canvas.height / 2);

ctx.textAlign = "right";

/** Update */
let update = (FPS, maxFPS) => {
    draw.clearCanvas(ctx, canvas.width / 2, 0, canvas.width / 2, canvas.height);
    ctx.fillStyle = FPS < maxFPS / 2 ? "red" : "lightgrey";
    draw.fillText(ctx, `${FPS} FPS`, canvas.width, canvas.height / 2);
};

export default {
    instance: canvas,
    update
};