const GAME = require('./main').default;

/** Variables */
let boss = {
    name: "Evil Pong",
    life: 100,
    damage: 25
};
let gameOver = false;
let bossMove;
let bossThink;

/** UI */
let gamePosition = {
    x: GAME.canvas.width / 10,
    y: GAME.canvas.height / 10,
    width: GAME.canvas.width * 4 / 5,
    height: GAME.canvas.height * 3 / 5
};
let panelPosition = {
    x: 0,
    y: gamePosition.y + gamePosition.height + 20,
    width: GAME.canvas.width,
    height: GAME.canvas.height - (gamePosition.y + gamePosition.height + 20) - 1
};
let barSize = {
    width: 10,
    height: gamePosition.height / 5
};
barSize.defaultHeight = barSize.height;
let playerBar = {
    x: gamePosition.x + 3,
    y: gamePosition.y + 1
};
let bossBar = {
    x: gamePosition.x + gamePosition.width - 3 - barSize.width,
    y: gamePosition.y + 1
};

/** Events */
let mouseMove = (event, x, y) => {
    playerBar.y = getBarY(y);
};

/** Helper Functions */
let getBarY = y => {
    let halfBar = barSize.height / 2;

    let newY = y - halfBar;

    if(newY < gamePosition.y)
        newY = gamePosition.y;
    else if(newY + barSize.height > gamePosition.y + gamePosition.height)
        newY = gamePosition.y + gamePosition.height - barSize.height;

    return newY;
};

/** State Functions */
let moveNPC = target => {
    let result = target - bossBar.y;

    if(result < -1 || result > 1)
        bossBar.y += result > 0 ? 1 : -1;
};

let thinkNPC = () => {
    let target = playerBar.y;

    clearInterval(bossMove);
    bossMove = setInterval(() => moveNPC(target), 3);
};

let startMatch = () => {
    bossThink = setInterval(thinkNPC, 500);
};

let endMatch = winner => {
    clearInterval(bossThink);
    clearInterval(bossMove);

    if(winner === 1)
        boss.life -= GAME.player.damage;
    else if(winner === 2)
        GAME.player.life -= boss.damage;

    if(boss.life <= 0 || GAME.player.life <= 0){
        onGameOver(boss.life <= 0 ? true : false);
        return;
    }

    setTimeout(() => startMatch(), 2000);
};

let onGameOver = result => {
    gameOver = true;

    setTimeout(() => {
        GAME.gameOver(result);
    }, 3000);
};

/** Draw Functions */
let drawBoard = () => {
    GAME.draw.strokeRect(gamePosition.x, gamePosition.y, gamePosition.width, gamePosition.height);
    GAME.draw.splitLine(gamePosition.x + gamePosition.width / 2, gamePosition.y, gamePosition.x + gamePosition.width / 2, gamePosition.y + gamePosition.height, 30);
};

let drawBars = () => {
    GAME.draw.fillRect(playerBar.x, playerBar.y, barSize.width, barSize.height);
    GAME.draw.fillRect(bossBar.x, bossBar.y, barSize.width, barSize.height);
};

let drawGameOver = () => {
    let msg = GAME.player.life <= 0 ? `${GAME.player.name} was Defeated!` : `${boss.name} was Defeated!`;
    GAME.draw.fillText(msg, panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2);
};

let drawBasePanel = () => {
    // Names
    GAME.draw.fillText(GAME.player.name, panelPosition.x + panelPosition.width / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});
    GAME.draw.fillText(boss.name, panelPosition.x + panelPosition.width * 3 / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});
    GAME.draw.fillText("x", panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});

    //Lives
    let maxSize = panelPosition.x + panelPosition.width / 4;
    let playerLifeSize = GAME.player.life / 100 * maxSize;
    let bossLifeSize = boss.life / 100 * maxSize;

    GAME.draw.fillRect(panelPosition.x + panelPosition.width / 8, panelPosition.y + panelPosition.height / 2, playerLifeSize, 20);
    GAME.draw.fillRect(panelPosition.x + panelPosition.width / 8 + playerLifeSize, panelPosition.y + panelPosition.height / 2, maxSize - playerLifeSize, 20, {fillStyle: "black"});

    GAME.draw.fillRect(panelPosition.x + panelPosition.width * 7 / 8 - maxSize, panelPosition.y + panelPosition.height / 2, bossLifeSize, 20);
    GAME.draw.fillRect(panelPosition.x + panelPosition.width * 7 / 8 - maxSize + bossLifeSize, panelPosition.y + panelPosition.height / 2, maxSize - bossLifeSize, 20, {fillStyle: "black"});
};

let drawPanel = () => {
    if(gameOver === true)
        drawGameOver();  
    else
        drawBasePanel();
};

/** Game Loop */
let start = () => {  
    //Game
    drawBoard();
    drawBars();

    //Panel
    drawPanel();
};

export default {
    start: () => {
        GAME.events.addMouseMove(mouseMove);
        startMatch();
        GAME.start(start)
    },
    stop: () => {
        boss.life = 100;
        resetBoard();
        gameOver = false;
        GAME.stop();
    }
};