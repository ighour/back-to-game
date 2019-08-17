const intro = (player, gameCallback) => {

/** Canvas Config */
const canvas = document.querySelector("canvas");
canvas.width = 480;
canvas.height = 560;

/** Context Config */
const ctx = canvas.getContext("2d");
ctx.lineWidth = 2;

/** Game Config */
const gameSize = {
    x: canvas.width,
    y: canvas.height
};

/** Events */
const onMouseClick = event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(x > canvas.width / 2 - 60 && x < canvas.width / 2 + 60 && y > canvas.height * 2 / 3 - 30 && y < canvas.height * 2 / 3 + 30)  {
        gameCallback();
    }
};

/** Draw */
const configText = (color = "white", font = "100px Arial", textBaseline = "middle", textAlign = "center") => {
    ctx.strokeStyle = color;
    ctx.font = font;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;
};

const drawLine = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const drawText = (text, x, y) => {
    ctx.strokeText(text, x, y);
};

/** Game Loop */
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    configText();

    //Title
    drawText("Back To #", canvas.width / 2, canvas.height / 3);

    //Start Game
    ctx.font = "40px Arial";
    drawText("Start", canvas.width / 2, canvas.height * 2 / 3);
    ctx.strokeRect(canvas.width / 2 - 60, canvas.height * 2 / 3 - 30, 120, 60);

    running = requestAnimationFrame(draw);
}

/** Game State */
let running;

/** Listeners */
canvas.addEventListener("click", onMouseClick);

/** Management */
return {
    start: () => {
        draw();
    },
    stop: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

};