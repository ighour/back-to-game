const GAME = require('./main').default;

/** Variables */
let gamePosition, startPosition, panelPosition, barSize;
let tutorial, boss, gameOver, p1Bar, p2Bar, ball, magnetic, mouse;

/** Events */
let click = (event, x, y) => {
    if(tutorial){
        //Start Button
        if(x > startPosition.x && x < startPosition.x + startPosition.width && y > startPosition.y && y < startPosition.y + startPosition.height)
            tutorial = false;
    }
};

let mouseMove = (event, x, y) => {
    if(!tutorial && x > gamePosition.x && x < gamePosition.x + gamePosition.width && y > gamePosition.y && y < gamePosition.y + gamePosition.height)
        mouse = {x, y};  
};

let mouseDown = (event) => {
    if(!tutorial)
        magnetic = true;
};

let mouseUp = (event) => {
    if(!tutorial)
        magnetic = false;
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

/** State Functions */
let setBallDirection = () => {
    let tempDir = {
        x: ball.directionX,
        y: ball.directionY 
    };

    if(magnetic){
        let relativeVector = {
            x: mouse.x - ball.x,
            y: mouse.y - ball.y
        };

        let mag = getMagVector(relativeVector.x, relativeVector.y);

        let normalizedVector = getNormalizedVector(relativeVector.x, relativeVector.y, mag);

        ball.forceX = normalizedVector.x;
        ball.forceY = normalizedVector.y;

        tempDir.x += ball.forceX / 10;
        tempDir.y += ball.forceY / 10;
    }

    let mag = getMagVector(tempDir.x, tempDir.y);
    let normDir = getNormalizedVector(tempDir.x, tempDir.y, mag);

    if(normDir.x > -0.3 && normDir.x < 0.3)
        normDir.x = normDir.x <= 0 ? -0.3 : 0.3;

    if(normDir.y > -0.3 && normDir.y < 0.3)
        normDir.y = normDir.y <= 0 ? -0.3 : 0.3;

    ball.directionX = normDir.x;
    ball.directionY = normDir.y;
};

let checkBallHit = (self, player) => {
    if(!gameOver){
        //Hit player
        if(self.B > player.y && self.T < player.y + barSize.height){
            gameOver = GAME.functions.doDamage(GAME.player, boss.damage);

            if(ball.speed < 2)
                ball.speed += Math.random() * 0.05;
        }
        //Hit wall
        else
            gameOver = GAME.functions.doDamage(boss, GAME.player.damage);
    }
};

let setBallPosition = () => {
    let move = ball.speed * GAME.delta / 1.5;

    let newX = ball.x + ball.directionX * move;
    let newY = ball.y + ball.directionY * move;

    let L = p1Bar.x + barSize.width;
    let R = p2Bar.x;
    let T = gamePosition.y;
    let B = gamePosition.y + gamePosition.height;

    let self = {
        L: newX - ball.radius,
        R: newX + ball.radius,
        T: newY - ball.radius,
        B: newY + ball.radius
    };

    //Hit left
    if(self.L < L){
        checkBallHit(self, p1Bar);
        newX = L + ball.radius;
        ball.directionX *= -1;
    }
    //Hit right
    else if(self.R > R){
        checkBallHit(self, p2Bar);
        newX = R - ball.radius;
        ball.directionX *= -1;
    }

    //Hit top
    if(self.T < T){
        newY = T + ball.radius;
        ball.directionY *= -1;
    }
    //Hit bottom
    else if(self.B > B){
        newY = B - ball.radius;
        ball.directionY *= -1;
    }

    ball.x = newX;
    ball.y = newY;
};

let moveBall = () => {
    setBallDirection();
    setBallPosition();
};

let moveNPC = (player, targetY) => {
    let target = {
        x: ball.x - player.x,
        y: targetY - player.y
    };

    let mag = getMagVector(target.x, target.y);
    let normVector = getNormalizedVector(target.x, target.y, mag);

    if(normVector.y >= -0.1 && normVector.y <= 0.1)
        return;

    let newY = player.y + normVector.y * GAME.delta;

    if(newY < gamePosition.y)
        newY = gamePosition.y;
    else if(newY + barSize.height > gamePosition.y + gamePosition.height)
        newY = gamePosition.y + gamePosition.height - barSize.height;
    
    player.y = newY;
};

let moveNPCs = () => {
    let targetY = getBarY(ball.y);

    moveNPC(p1Bar, targetY);
    moveNPC(p2Bar, targetY);
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
        "Your mouse has a magnetical field when clicked down.",
        "Crashing on bars will hurt you and push the ball."
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

    //Magnetic
    if(magnetic){
        let magX = panelPosition.x + panelPosition.width / 2;
        let magY = panelPosition.y + panelPosition.height / 2 - 50;
        GAME.draw.fillCircle(magX, magY, 10);
        GAME.draw.strokeCircle(magX + ball.forceX * 10, magY + ball.forceY * 10, 20);
    }
    else
        GAME.draw.strokeCircle(panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2 - 50, 10);
};

let drawPanel = () => {
    if(gameOver === true)
        drawGameOver();  
    else
        drawBasePanel();
};

/** Lifecycle */
let onStart = _win => {
    //UI
    gamePosition = {
        x: GAME.canvas.width / 10,
        y: GAME.canvas.height / 10,
        width: GAME.canvas.width * 4 / 5,
        height: GAME.canvas.height * 3 / 5
    };
    startPosition = {
        x: GAME.canvas.width / 2 - 90,
        y: GAME.canvas.height * 5 / 6 - 30,
        width: 180,
        height: 60
    };
    panelPosition = {
        x: 0,
        y: gamePosition.y + gamePosition.height + 20,
        width: GAME.canvas.width,
        height: GAME.canvas.height - (gamePosition.y + gamePosition.height + 20) - 1
    };
    barSize = {
        width: 10,
        height: gamePosition.height / 5
    };

    //State
    boss = {
        name: "Evil Pong",
        life: 100,
        damage: 1
    };
    tutorial = true;
    gameOver = false;
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
    magnetic = false;
    mouse = {
        x: ball.x,
        y: ball.y
    };

    //Engine
    GAME.player.damage = 10;
    GAME.events.addMouseMove(mouseMove);
    GAME.events.addClick(click);
    GAME.events.addMouseDown(mouseDown);
    GAME.events.addMouseUp(mouseUp);
};

let onUpdate = () => {
    if(tutorial)
        drawTutorial();
    else {
        //Logic
        moveNPCs();
        moveBall();

        //Game
        drawBoard();
        drawBars();
        drawBall();

        //Panel
        drawPanel();
    }
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export default {onStart, onUpdate};