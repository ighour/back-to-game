const draw = require("./helpers").default;

export const drawTutorial = (ctx, width, height, title, year, boss, intel, startPosition) => {
    //Mission
    draw.fillText(ctx, title, width / 2, height / 5, {font: "100px Arial"});

    //Brief
    let texts = [
        "Year:",
        `Boss:`,
        "Intel:"
    ];
    draw.fillTextBlock(ctx, texts, width / 20, height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    texts = [
        year,
        boss
    ];
    draw.fillTextBlock(ctx, texts, width / 20 + 100, height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    draw.fillTextBlock(ctx, intel, width / 20 + 100, height * 2 / 5 + 140, 35, {textAlign: "left", font: "30px Arial"});

    //Start
    draw.fillText(ctx, "Travel", startPosition.x + startPosition.width / 2, startPosition.y + startPosition.height / 2);
    draw.strokeRect(ctx, startPosition.x, startPosition.y, startPosition.width, startPosition.height);
};

export const drawGameOver = (ctx, panelPosition, player, boss) => {
    let msg = boss.life <= 0 ? `${boss.name} was Defeated!` : `${player.name} was Defeated!`;
    draw.fillText(ctx, msg, panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2);
};

export const drawPlayerPanel = (ctx, panelPosition, player, boss) => {
    // Names
    draw.fillText(ctx, player.name, panelPosition.x + panelPosition.width / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});
    draw.fillText(ctx, boss.name, panelPosition.x + panelPosition.width * 3 / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});

    //Life    
    let maxSize = panelPosition.x + panelPosition.width / 4;
    let playerLifeSize = player.life / 100 * maxSize;
    let bossLifeSize = boss.life / 100 * maxSize;

    draw.fillRect(ctx, panelPosition.x + panelPosition.width / 8, panelPosition.y + panelPosition.height - 100, playerLifeSize, 20);
    draw.fillRect(ctx, panelPosition.x + panelPosition.width / 8 + playerLifeSize, panelPosition.y + panelPosition.height - 100, maxSize - playerLifeSize, 20, {fillStyle: "black"});

    draw.fillRect(ctx, panelPosition.x + panelPosition.width * 7 / 8 - maxSize, panelPosition.y + panelPosition.height - 100, bossLifeSize, 20);
    draw.fillRect(ctx, panelPosition.x + panelPosition.width * 7 / 8 - maxSize + bossLifeSize, panelPosition.y + panelPosition.height - 100, maxSize - bossLifeSize, 20, {fillStyle: "black"});
};

export const drawMouseDirection = (ctx, panelPosition, x, y) => {
    let dirX = panelPosition.x + panelPosition.width / 2;
    let dirY = panelPosition.y + panelPosition.height / 2;
    draw.fillCircle(ctx, dirX, dirY, 10);
    draw.strokeCircle(ctx, dirX + x * 10, dirY + y * 10, 20);
};