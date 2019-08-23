const GAME = require('../../game').default;

/** Variables */
let gamePosition, startButton, barSize;
let tutorial, gameOver, p1Bar, p2Bar, ball, magnetic, mouse;

/** Events */
let clickStart = () => tutorial = false;
let mouseMove = (event, x, y) => {if(!tutorial) mouse = {x, y}};
let mouseDown = () => {if(!tutorial) magnetic = true};
let mouseUp = () => {if(!tutorial) magnetic = false};

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

/** Logic */
let logic = () => {
    if(tutorial)
        return;

    moveNPCs();
    moveBall();
};

let moveNPCs = () => {
    let targetY = getBarY(ball.y);

    moveNPC(p1Bar, targetY);
    moveNPC(p2Bar, targetY);
};

let moveNPC = (player, targetY) => {
    let target = {
        x: ball.x - player.x,
        y: targetY - player.y
    };

    let normVector = GAME.functions.getNormalizedVector(target.x, target.y);

    if(normVector.y >= -0.1 && normVector.y <= 0.1)
        return;

    let newY = player.y + normVector.y * GAME.delta;

    if(newY < gamePosition.y)
        newY = gamePosition.y;
    else if(newY + barSize.height > gamePosition.y + gamePosition.height)
        newY = gamePosition.y + gamePosition.height - barSize.height;
    
    player.y = newY;
};

let moveBall = () => {
    setBallDirection();
    setBallPosition();
};

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

        let normalizedVector = GAME.functions.getNormalizedVector(relativeVector.x, relativeVector.y);

        ball.forceX = normalizedVector.x;
        ball.forceY = normalizedVector.y;

        tempDir.x += ball.forceX / 50;
        tempDir.y += ball.forceY / 50;
    }

    let normDir = GAME.functions.getNormalizedVector(tempDir.x, tempDir.y);

    if(normDir.x > -0.5 && normDir.x < 0.5)
        normDir.x = normDir.x <= 0 ? -0.5 : 0.5;

    if(normDir.y > -0.5 && normDir.y < 0.5)
        normDir.y = normDir.y <= 0 ? -0.5 : 0.5;

    ball.directionX = normDir.x;
    ball.directionY = normDir.y;
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

let checkBallHit = (self, player) => {
    if(!gameOver){
        //Hit player
        if(self.B > player.y && self.T < player.y + barSize.height){
            gameOver = GAME.functions.doDamagePlayer();

            if(ball.speed < 2)
                ball.speed += Math.random() * 0.05;
        }
        //Hit wall
        else
            gameOver = GAME.functions.doDamageBoss();
    }
}

/** Draw Functions */
let draw = () => {
    if(tutorial){
        let intel = [
            "The boss loses HP when the ball is out.",
            "Your mouse has a magnetical field when clicked down.",
            "Crashing on bars will hurt you and push the ball."
        ];
        GAME.draw.drawTutorial("Mission #2", "1972", intel, startButton);
    }
    else {
        drawBoard();
        drawBars();
        drawBall();
        drawPanel();
    }
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

let drawPanel = () => {
    if(gameOver === true)
        GAME.draw.drawGameOver();  
    else{
        GAME.draw.drawPanel();

        if(magnetic)
            GAME.draw.drawMouseDirection(ball.forceX, ball.forceY);
        else
            GAME.draw.strokeCircle(GAME.canvas.panelPosition.x + GAME.canvas.panelPosition.width / 2, GAME.canvas.panelPosition.y + GAME.canvas.panelPosition.height / 2, 10);
    }
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
    startButton = {
        x: GAME.canvas.width / 2 - 90,
        y: GAME.canvas.height * 9 / 10 - 30,
        width: 180,
        height: 60
    };
    barSize = {
        width: 10,
        height: gamePosition.height / 5
    };

    //State
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
    GAME.boss.name = "Evil Pong";
    GAME.boss.life = 100;
    GAME.boss.damage = 1;

    GAME.addEvent("click", clickStart, startButton.x, startButton.y, startButton.width, startButton.height);
    GAME.addEvent("mousemove", mouseMove);
    GAME.addEvent("mousedown", mouseDown);
    GAME.addEvent("mouseup", mouseUp);
};

let onUpdate = () => {
    logic();
    draw();
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export default {onStart, onUpdate};