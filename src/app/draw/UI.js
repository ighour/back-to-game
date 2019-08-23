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
        boss
    ];
    draw.fillTextBlock(texts, width / 20 + 100, height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    draw.fillTextBlock(intel, width / 20 + 100, height * 2 / 5 + 140, 35, {textAlign: "left", font: "30px Arial"});

    //Start
    draw.fillText("Travel", startPosition.x + startPosition.width / 2, startPosition.y + startPosition.height / 2);
    draw.strokeRect(startPosition.x, startPosition.y, startPosition.width, startPosition.height);
};

/** Game Lose */
export const drawGameOver = (draw, panelPosition, player, boss) => {
    let msg = boss.life <= 0 ? `${boss.name} was Defeated!` : `${player.name} was Defeated!`;
    draw.fillText(msg, panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2);
};

/** Panel */
export const drawPlayerPanel = (draw, panelPosition, player, boss) => {
    // Names
    draw.fillText(player.name, panelPosition.x + panelPosition.width / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});
    draw.fillText(boss.name, panelPosition.x + panelPosition.width * 3 / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});

    //Life    
    let maxSize = panelPosition.x + panelPosition.width / 4;
    let playerLifeSize = player.life / 100 * maxSize;
    let bossLifeSize = boss.life / 100 * maxSize;

    draw.fillRect(panelPosition.x + panelPosition.width / 8, panelPosition.y + panelPosition.height - 100, playerLifeSize, 20);
    draw.fillRect(panelPosition.x + panelPosition.width / 8 + playerLifeSize, panelPosition.y + panelPosition.height - 100, maxSize - playerLifeSize, 20, {fillStyle: "black"});

    draw.fillRect(panelPosition.x + panelPosition.width * 7 / 8 - maxSize, panelPosition.y + panelPosition.height - 100, bossLifeSize, 20);
    draw.fillRect(panelPosition.x + panelPosition.width * 7 / 8 - maxSize + bossLifeSize, panelPosition.y + panelPosition.height - 100, maxSize - bossLifeSize, 20, {fillStyle: "black"});
};

/** Mouse Direction */
export const drawMouseDirection = (draw, panelPosition, x, y) => {
    let dirX = panelPosition.x + panelPosition.width / 2;
    let dirY = panelPosition.y + panelPosition.height / 2;
    draw.fillCircle(dirX, dirY, 10);
    draw.strokeCircle(dirX + x * 10, dirY + y * 10, 20);
};