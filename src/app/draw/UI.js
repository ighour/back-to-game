/** Button */
export const drawButton = (draw, position, text, styles) => {
    draw.fillText(text, position.x + position.width / 2, position.y + position.height / 2, styles);
    draw.strokeRect(position.x, position.y, position.width, position.height, styles);
};

/** Tutorial of Games */
export const drawTutorial = (draw, width, height, title, year, boss, intel, startPosition) => {
    //Mission
    draw.fillText(title, width / 2, height / 5, {font: "100px Arial"});

    //Brief
    let texts = [
        "Year:",
        `Boss:`,
        "Intel:"
    ];
    draw.fillTextBlock(texts, width / 20, height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    texts = [
        year,
        boss.name
    ];
    draw.fillTextBlock(texts, width / 20 + 100, height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    draw.fillTextBlock(intel, width / 20 + 100, height * 2 / 5 + 140, 40, {textAlign: "left", font: "30px Arial"});

    //Start
    drawButton(draw, startPosition, "Travel");
};

/** Panel */
export const drawPanel = (draw, position, player, boss, text) => {
    if(text)
        draw.fillText(text, position.x + position.width / 2, position.y + position.height / 2);
    else{
        // Names
        draw.fillText(player.name, position.x + position.width / 4, position.y + position.height - 20, {textBaseline: "bottom"});
        draw.fillText(boss.name, position.x + position.width * 3 / 4, position.y + position.height - 20, {textBaseline: "bottom"});

        //Life    
        let maxSize = position.x + position.width / 4;
        let playerLifeSize = player.life / 100 * maxSize;
        let bossLifeSize = boss.life / 100 * maxSize;

        draw.fillRect(position.x + position.width / 8, position.y + position.height - 100, playerLifeSize, 20);
        draw.fillRect(position.x + position.width / 8 + playerLifeSize, position.y + position.height - 100, maxSize - playerLifeSize, 20, {fillStyle: "black"});

        draw.fillRect(position.x + position.width * 7 / 8 - maxSize, position.y + position.height - 100, bossLifeSize, 20);
        draw.fillRect(position.x + position.width * 7 / 8 - maxSize + bossLifeSize, position.y + position.height - 100, maxSize - bossLifeSize, 20, {fillStyle: "black"});
    }
};

/** Mouse Direction */
export const drawMouseDirection = (draw, position, x, y) => {
    let dirX = position.x + position.width / 2;
    let dirY = position.y + position.height / 2;
    draw.fillCircle(dirX, dirY, 10);
    draw.strokeCircle(dirX + x * 10, dirY + y * 10, 20);
};