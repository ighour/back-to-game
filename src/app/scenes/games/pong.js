const { GAME } = require('../../game');

/** Variables */
let gamePosition, startButton, barSize, tutorial, gameOver, p1Bar, p2Bar, ball, magnetic, mouse;

/** Events */
let clickStart = () => tutorial = false;
let mouseMove = (event, x, y) => {if(!tutorial) mouse = {x, y}};
let mouseDown = () => {if(!tutorial) magnetic = true};
let mouseUp = () => {if(!tutorial) magnetic = false};

/** Helper Functions */
let getBarY = y => {

};

/** Logic */
let logic = () => {
    if(tutorial)
        return;

    moveNPCs();
    setBallDirection();
    setBallPosition();
};

let moveNPCs = () => {
    let targetY = ball.y - barSize.h / 2, y = gamePosition.y + gamePosition.h - barSize.h;

    if(targetY < gamePosition.y)
        targetY = gamePosition.y;
    else if(targetY > y)
        targetY = y;

    moveNPC(p1Bar, targetY);
    moveNPC(p2Bar, targetY);
};

let moveNPC = (player, targetY) => {
    let target = {
        x: ball.x - player.x,
        y: targetY - player.y
    };

    let normVector = GAME.f.norm(target.x, target.y);

    if(normVector.y >= -0.1 && normVector.y <= 0.1)
        return;

    let newY = player.y + normVector.y * GAME.dt;

    let y = gamePosition.y + gamePosition.h - barSize.h;
    if(newY < gamePosition.y)
        newY = gamePosition.y;
    else if(newY > y)
        newY = y;
    
    player.y = newY;
};

let setBallDirection = () => {
    let tempDir = {
        x: ball.dx,
        y: ball.dy 
    };

    if(magnetic){
        let relativeVector = {
            x: mouse.x - ball.x,
            y: mouse.y - ball.y
        };

        let normalizedVector = GAME.f.norm(relativeVector.x, relativeVector.y);

        ball.fx = normalizedVector.x;
        ball.fy = normalizedVector.y;

        tempDir.x += ball.fx / 50;
        tempDir.y += ball.fy / 50;
    }

    let normDir = GAME.f.norm(tempDir.x, tempDir.y);

    if(normDir.x > -0.5 && normDir.x < 0.5)
        normDir.x = normDir.x <= 0 ? -0.5 : 0.5;

    if(normDir.y > -0.5 && normDir.y < 0.5)
        normDir.y = normDir.y <= 0 ? -0.5 : 0.5;

    ball.dx = normDir.x;
    ball.dy = normDir.y;
};

let setBallPosition = () => {
    let move = ball.s * GAME.dt / 1.5;

    let newX = ball.x + ball.dx * move;
    let newY = ball.y + ball.dy * move;

    let L = p1Bar.x + barSize.w;
    let R = p2Bar.x;
    let T = gamePosition.y;
    let B = gamePosition.y + gamePosition.h;

    let self = {
        L: newX - ball.r,
        R: newX + ball.r,
        T: newY - ball.r,
        B: newY + ball.r
    };

    //Hit left
    if(self.L < L){
        checkBallHit(self, p1Bar);
        newX = L + ball.r;
        ball.dx *= -1;
    }
    //Hit right
    else if(self.R > R){
        checkBallHit(self, p2Bar);
        newX = R - ball.r;
        ball.dx *= -1;
    }

    //Hit top
    if(self.T < T){
        newY = T + ball.r;
        ball.dy *= -1;
    }
    //Hit bottom
    else if(self.B > B){
        newY = B - ball.r;
        ball.dy *= -1;
    }

    ball.x = newX;
    ball.y = newY;
};

let checkBallHit = (self, player) => {
    if(!gameOver){
        //Hit player
        if(self.B > player.y && self.T < player.y + barSize.h){
            gameOver = GAME.f.dp();

            if(ball.s < 2)
                ball.s += Math.random() * 0.05;
        }
        //Hit wall
        else
            gameOver = GAME.f.db();
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
        GAME.d.dt("Mission #2", "1972", intel, startButton);
    }
    else {
        //Board
        GAME.d.sr(gamePosition.x, gamePosition.y, gamePosition.w, gamePosition.h);
        GAME.d.sl(gamePosition.x + gamePosition.w / 2, gamePosition.y, gamePosition.x + gamePosition.w / 2, gamePosition.y + gamePosition.h, 30);

        //Bars
        GAME.d.fr(p1Bar.x, p1Bar.y, barSize.w, barSize.h);
        GAME.d.fr(p2Bar.x, p2Bar.y, barSize.w, barSize.h);

        //Ball
        GAME.d.fc(ball.x, ball.y, ball.r);

        //Panel
        if(gameOver === true)
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} was Defeated!` : `${GAME.p.n} was Defeated!`);  
        else{
            GAME.d.dp();

            if(magnetic)
                GAME.d.dmd(ball.fx, ball.fy);
            else
                GAME.d.sc(GAME.c.p.x + GAME.c.p.w / 2, GAME.c.p.y + GAME.c.p.h / 2, 10);
        }
    }
};

/** Lifecycle */
let onStart = () => {
    let x = GAME.c.w / 10, y = GAME.c.h / 10;
    //UI
    gamePosition = {
        x,
        y,
        w: x * 8,
        h: y * 6
    };
    startButton = {
        x: x * 5 - 105,
        y: y * 8.5,
        w: 210,
        h: 60
    };
    barSize = {
        w: 10,
        h: gamePosition.h / 5
    };
    p1Bar = {
        x: gamePosition.x + 3,
        y: gamePosition.y + gamePosition.h / 2
    };
    p2Bar = {
        x: gamePosition.x + gamePosition.w - 3 - barSize.w,
        y: p1Bar.y
    };

    //State
    tutorial = true;
    gameOver = false;
    ball = {
        x: gamePosition.x + gamePosition.w / 2,
        y: gamePosition.y + gamePosition.h / 2,
        r: 7,
        dx: Math.random(),
        dy: Math.random(),
        fx: 0,
        fy: 0,
        s: 1
    };
    magnetic = false;
    mouse = {
        x: ball.x,
        y: ball.y
    };

    //Engine
    GAME.p.d = 10;
    GAME.b.n = "Evil Pong";
    GAME.b.l = 100;
    GAME.b.d = 1;

    GAME.e("click", clickStart, startButton.x, startButton.y, startButton.w, startButton.h);
    GAME.e("mousemove", mouseMove);
    GAME.e("mousedown", mouseDown);
    GAME.e("mouseup", mouseUp);
};

let onUpdate = () => {
    logic();
    draw();
};

// let onReset = () => {

// };

// let onStop = () => {

// };

export const PONG = {os: onStart, ou: onUpdate};