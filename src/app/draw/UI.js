const { drawButton, drawLifeCircle, drawTexts } = require("./components");

/** Tutorial of Games */
export const drawTutorial = (draw, canvas, tutorial, title, texts, timer, button, buttonTitle) => {
    tutorial--;

    draw.ft(title[tutorial], canvas.width / 2, 70, {f: 70});

    drawTexts(draw, texts[tutorial], 20, 160, {ta: "l", f: 30}, timer);

    if(timer >= 1000)
        drawButton(draw, button[tutorial], buttonTitle[tutorial]);
};

/** Panel */
export const drawPanel = (draw, position, player, boss, text) => {
    //Divisor
    draw.l(position.x, position.y + 5, position.x + position.w, position.y + 5, {ss: "#444444"});

    //Life
    let x = position.x + position.w / 12, y = position.y + position.h / 2, radius = 50;
    drawLifeCircle(draw, x, y, radius, player.l);
    drawLifeCircle(draw, x * 11, y, radius, boss.l);

    if(text)
        draw.ft(text, position.x + position.w / 2, position.y + position.h / 2);
    else{
        // Names
        let tb = "b";
        y += position.h / 2;
        radius += 5;
        draw.ft(player.n, x + radius, y, {tb, ta: "l"});
        draw.ft(boss.n, x * 11 - radius, y, {tb, ta: "r"});
    }
};