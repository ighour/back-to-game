const { GAME } = require('../../game');

/** Variables */
let gamePosition, travelButton, startButton, barSize, tutorial, gameOver, p1Bar, p2Bar, ball, magnetic, mouse, textTimer, scoreChange;

/** Events */
let clickTravel = () => {
    if(tutorial == 1){
        setTimeout(() => {textTimer = 0; tutorial = 2}, 100);
    }
};

let clickStart = () => {
    if(tutorial == 2){
        tutorial = 0;
    }
};
let mouseMove = (event, x, y) => {if(tutorial == 0) mouse = {x, y}};
let mouseDown = () => {if(tutorial == 0) magnetic = true};
let mouseUp = () => {if(tutorial == 0) magnetic = false};

/** Helper Functions */

/** Logic */
let logic = () => {
    if(tutorial != 0)
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
            gameOver = GAME.f.dp(undefined, scoreChange[0]);

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
    if(tutorial != 0){
        textTimer += GAME.dt;

        let sp = 70, tm = 50;

        GAME.d.dt(tutorial,
            ["Mission #2", "Controls"],
            [
                [
                    {c: "The year is 1972.", sp, tm},
        
                    {c: "Evil Chess has taken control of Pong. Your second mission is to defeat", sp: sp / 1.8, tm},
                    {c: "Pong in order to restart it.", sp, tm},
        
                    {c: "You will receive control of a magnetic field with the power to influence the", sp: sp / 1.8, tm},
                    {c: "movement of the ball on the field.", sp, tm},
        
                    {c: "However, Pong will do everything to avoid the ball going out of bounds by ", sp: sp / 1.8, tm},
                    {c: "controlling the side bars.", sp, tm},
        
                    {c: "Your goal, then, is to get the ball out of the field to weaken the Pong. But", sp: sp / 1.8, tm},
                    {c: "be careful, you can be hurt when hitting the side bars.", sp: sp * 1.1, tm},
        
                    {c: "Are you ready for the mission?", sp, tm, s: {ta: "c"}, x: GAME.c.x + GAME.c.w / 2},
                ],
                [
                    {c: "- Use your mouse to move through the game area.", sp, tm},
        
                    {c: "- Click to activate the magnetic field.", sp, tm},
        
                    {c: "- It will try to push the ball to your mouse position.", sp, tm},
        
                    {c: "- This can slightly change ball direction.", sp, tm},

                    {c: "- Check the panel at bottom to see the direction of you magnetic field.", sp, tm},
                ]
            ],
            textTimer,
            [travelButton, startButton],
            ["Travel to 1972", "Play"]
        );
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
            GAME.d.dp(GAME.b.l <= 0 ? `${GAME.b.n} is now rebooting...` : `${GAME.p.n} was Defeated!`);  
        else{
            GAME.d.dp();
            GAME.d.dap(ball.fx, ball.fy, magnetic);
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
    travelButton = {
        x: x * 5 - 180,
        y: y * 10 - 72,
        w: 360,
        h: 60
    };
    startButton = {
        x: x * 5 - 120,
        y: y * 10 - 100,
        w: 240,
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
    tutorial = 1;
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
    textTimer = 0;
    scoreChange = [
        -10
    ];

    //Engine
    GAME.p.d = 10 * GAME.p.m;
    GAME.p.s[GAME.cu()] = 1000 / Math.pow(GAME.p.m, 2);
    GAME.b.n = "Pong";
    GAME.b.l = 100;
    GAME.b.d = 1;

    GAME.e("click", clickTravel, travelButton);
    GAME.e("click", clickStart, startButton);
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