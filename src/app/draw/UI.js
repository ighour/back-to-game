const { drawButton, drawLifeCircle } = require("./components");

/** Tutorial of Games */
export const drawTutorial = (draw, width, height, title, year, boss, intel, startPosition) => {
    //Mission
    draw.ft(title, width / 2, height / 5, {f: "100"});

    //Brief
    let f = 30;
    let ta = "l";
    let texts = [
        "Year:",
        `Boss:`,
        "Intel:"
    ];
    draw.ftb(texts, width / 20, height * 2 / 5, 70, {ta, f});

    texts = [
        year,
        boss.n
    ];
    draw.ftb(texts, width / 20 + 100, height * 2 / 5, 70, {ta, f});

    draw.ftb(intel, width / 20 + 100, height * 2 / 5 + 140, 40, {ta, f});

    //Start
    drawButton(draw, startPosition, "Travel");
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