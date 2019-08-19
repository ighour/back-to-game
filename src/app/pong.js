const GAME = require('./main').default;

/** Variables */
let tutorial = true;
let boss = {
    name: "Evil Pong",
    life: 100,
    damage: 1
};
let gameOver = false;
let playerThink;
let playerMove;
let ballMove;
let damageTimer;
let p1Bar = {
    x: 0,
    y: 0
};
let p2Bar = {
    x: 0,
    y: 0
};
let ball = {
    x: 0,
    y: 0,
    radius: 0,
    directionX: 0,
    directionY: 0,
    forceX: 0,
    forceY: 0,
    speed: 0
};

/** UI */
let gamePosition = {
    x: GAME.canvas.width / 10,
    y: GAME.canvas.height / 10,
    width: GAME.canvas.width * 4 / 5,
    height: GAME.canvas.height * 3 / 5
};
let startPosition = {
    x: GAME.canvas.width / 2 - 90,
    y: GAME.canvas.height * 5 / 6 - 30,
    width: 180,
    height: 60
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

/** Events */
let click = (event, x, y) => {
    if(tutorial){
        //Start Button
        if(x > startPosition.x && x < startPosition.x + startPosition.width && y > startPosition.y && y < startPosition.y + startPosition.height){
            tutorial = false;
            startMatch();
        }
    }
};

let mouseMove = (event, x, y) => {
    if(!tutorial && x > gamePosition.x && x < gamePosition.x + gamePosition.width && y > gamePosition.y && y < gamePosition.y + gamePosition.height){
        let relativeVector = {
            x: x - ball.x,
            y: y - ball.y
        };

        let mag = getMagVector(relativeVector.x, relativeVector.y);

        let normalizedVector = getNormalizedVector(relativeVector.x, relativeVector.y, mag);

        ball.forceX = normalizedVector.x;
        ball.forceY = normalizedVector.y;
    }   
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

let getMagVector = (x, y) => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

let getNormalizedVector = (x, y, mag) => {
    if(mag === 0)
        return {x: 0, y: 0};

    return {
        x: x / mag,
        y: y / mag
    };
};

let touchBorder = () => {
    if(ball.x <= p1Bar.x + barSize.width){
        if(ball.y >= p1Bar.y - 1 && ball.y <= p1Bar.y + barSize.height + 1)
            return "lb";
        else
            return "l";
    }
    else if(ball.x >= p2Bar.x){
        if(ball.y >= p2Bar.y - 1 && ball.y <= p2Bar.y + barSize.height + 1)
            return "rb";
        else
            return "r";
    }
    return "";
};

/** State Functions */
let clearBoard = () => {
    barSize.height = gamePosition.height / 5;
    p1Bar = {
        x: gamePosition.x + 3,
        y: gamePosition.y + gamePosition.height / 2
    };
    p2Bar = {
        x: gamePosition.x + gamePosition.width - 3 - barSize.width,
        y: p1Bar.y
    };
    ball = {
        x: gamePosition.x + gamePosition.width / 2,
        y: gamePosition.y + gamePosition.height / 2,
        radius: 7,
        directionX: Math.random(),
        directionY: Math.random(),
        forceX: 0,
        forceY: 0,
        speed: 1
    };
};

let doDamage = (player, damage) => {
    player.life -= damage;

    if(player.life <= 0)
        onGameOver();
};

let checkTouch = () => {
    let touch = touchBorder();

    if(touch === "rb" || touch === "lb"){
        clearTimeout(damageTimer);
        damageTimer = setTimeout(() => doDamage(GAME.player, boss.damage), 100);

        ball.speed += Math.random() - 0.5;

        if(ball.speed < 2.5)
            ball.speed += 0.5;
        else if(ball.speed > 4)
            ball.speed -= 0.5;
    }
    else if(touch === "r" || touch === "l"){
        clearTimeout(damageTimer);
        damageTimer = setTimeout(() => doDamage(boss, GAME.player.damage), 100);
    }
};

let moveBall = () => {
    checkTouch();

    let tempDir = {
        x: ball.directionX + ball.forceX / 50,
        y: ball.directionY + ball.forceY / 50
    };

    let mag = getMagVector(tempDir.x, tempDir.y);
    let normDir = getNormalizedVector(tempDir.x, tempDir.y, mag);

    if(normDir.x > -0.4 && normDir.x < 0.4)
        normDir.x = normDir.x <= 0 ? -0.4 : 0.4;

    if(normDir.y > -0.4 && normDir.y < 0.4)
        normDir.y = normDir.y <= 0 ? -0.4 : 0.4;

    ball.directionX = normDir.x;
    ball.directionY = normDir.y;

    let left = ball.x <= gamePosition.x + barSize.width + 2;
    let right = ball.x >= gamePosition.x + gamePosition.width - barSize.width - 2;
    let top = ball.y <= gamePosition.y + 2;
    let bottom = ball.y >= gamePosition.y + gamePosition.height - 2;

    if(left && normDir.x < 0 || right && normDir.x > 0)
        ball.directionX *= -1;

    if(top && normDir.y < 0 || bottom && normDir.y > 0)
        ball.directionY *= -1;

    ball.x += ball.directionX * ball.speed;
    ball.y += ball.directionY * ball.speed;
};

let moveNPC = target => {
    let result = target - p1Bar.y;

    let distance = Math.random() * 2 + 1;

    if(result < -1 || result > 1){
        p1Bar.y += result > 0 ? distance : -distance;
        p2Bar.y = p1Bar.y;
    }  
};

let thinkNPC = () => {
    let target = getBarY(ball.y + Math.random() * 10 - 5);
    clearInterval(playerMove);
    playerMove = setInterval(() => moveNPC(target), Math.random() * 4 + 1);
};

let startMatch = () => {
    playerThink = setInterval(thinkNPC, 100);
    ballMove = setInterval(moveBall, 3);
};

let onGameOver = () => {
    clearInterval(damageTimer);
    clearInterval(playerThink);
    clearInterval(playerMove);
    clearInterval(ballMove);

    gameOver = true;

    setTimeout(() => {
        GAME.gameOver(boss.life <= 0 ? true : false);
    }, 3000);
};

/** Draw Functions */
let drawTutorial = () => {
    //Mission
    GAME.draw.fillText("Mission #1", GAME.canvas.width / 2, GAME.canvas.height / 5, {font: "100px Arial"});

    //Brief
    let texts = [
        "Year:",
        `Boss:`,
        "Intel:"
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 20, GAME.canvas.height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    texts = [
        "1972",
        boss.name
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 20 + 100, GAME.canvas.height * 2 / 5, 70, {textAlign: "left", font: "30px Arial"});

    texts = [
        "The boss loses HP when the ball is out.",
        "Your mouse has a magnetical field.",
        "Crashing on bars will hurt you."
    ];
    GAME.draw.fillTextBlock(texts, GAME.canvas.width / 20 + 100, GAME.canvas.height * 2 / 5 + 140, 35, {textAlign: "left", font: "30px Arial"});

    //Start
    GAME.draw.fillText("Travel", startPosition.x + startPosition.width / 2, startPosition.y + startPosition.height / 2);
    GAME.draw.strokeRect(startPosition.x, startPosition.y, startPosition.width, startPosition.height);
};

let drawBoard = () => {
    GAME.draw.strokeRect(gamePosition.x, gamePosition.y, gamePosition.width, gamePosition.height);
    GAME.draw.splitLine(gamePosition.x + gamePosition.width / 2, gamePosition.y, gamePosition.x + gamePosition.width / 2, gamePosition.y + gamePosition.height, 30);
};

let drawBars = () => {
    GAME.draw.fillRect(p1Bar.x, p1Bar.y, barSize.width, barSize.height);
    GAME.draw.fillRect(p2Bar.x, p2Bar.y, barSize.width, barSize.height);
};

let drawBall = () => {
    GAME.draw.fillCircle(ball.x, ball.y, ball.radius);
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

    // Lives
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
    if(tutorial){
        drawTutorial();
    }
    else{
        //Game
        drawBoard();
        drawBars();
        drawBall();

        //Panel
        drawPanel();
    }
};

export default {
    start: () => {
        GAME.player.damage = 10;

        tutorial = true;
        boss.life = 100;
        gameOver = false;

        clearBoard();

        GAME.events.addMouseMove(mouseMove);
        GAME.events.addClick(click);

        GAME.start(start)
    },
    stop: () => {
        clearInterval(damageTimer);
        clearInterval(playerThink);
        clearInterval(playerMove);
        clearInterval(ballMove);

        GAME.stop();
    }
};