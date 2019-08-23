/** Button */
export const drawButton = (draw, position, text, styles) => {
    draw.ft(text, position.x + position.w / 2, position.y + position.h / 2, styles);
    draw.sr(position.x, position.y, position.w, position.h, styles);
};

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
    if(text)
        draw.ft(text, position.x + position.w / 2, position.y + position.h / 2);
    else{
        // Names
        let tb = "b";
        draw.ft(player.n, position.x + position.w / 4, position.y + position.h - 20, {tb});
        draw.ft(boss.n, position.x + position.w * 3 / 4, position.y + position.h - 20, {tb});

        //Life    
        let maxSize = position.x + position.w / 4;
        let playerLifeSize = player.l / 100 * maxSize;
        let bossLifeSize = boss.l / 100 * maxSize;

        let fs = "black";
        draw.fr(position.x + position.w / 8, position.y + position.h - 100, playerLifeSize, 20);
        draw.fr(position.x + position.w / 8 + playerLifeSize, position.y + position.h - 100, maxSize - playerLifeSize, 20, {fs});

        draw.fr(position.x + position.w * 7 / 8 - maxSize, position.y + position.h - 100, bossLifeSize, 20);
        draw.fr(position.x + position.w * 7 / 8 - maxSize + bossLifeSize, position.y + position.h - 100, maxSize - bossLifeSize, 20, {fs});
    }
};

/** Mouse Direction */
export const drawMouseDirection = (draw, position, x, y) => {
    let dirX = position.x + position.w / 2;
    let dirY = position.y + position.h / 2;
    draw.fc(dirX, dirY, 10);
    draw.sc(dirX + x * 10, dirY + y * 10, 20);
};