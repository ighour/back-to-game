/** External Config */
const player = {
    name: "John Doe",
    life: 3
};

/** Canvas Config */
const canvas = document.querySelector("canvas");
canvas.width = 480;
canvas.height = 560;

/** Context Config */
const ctx = canvas.getContext("2d");
ctx.lineWidth = 2;

/** Game Config */
const boss = {
    name: "Evil Tic",
    life: 3
};

const gameSize = {
    x: 480,
    y: 480
};

const panelSize = {
    x: canvas.width,
    y: canvas.height - gameSize.y
};

const cellSize = {
    x: gameSize.x / 3,
    y: gameSize.y / 3
};

/** Helpers */
const getSelectedSquare = (x, y) => {
    return {
        x: Math.floor(x / cellSize.x),
        y: Math.floor(y / cellSize.y)
    };
};

const checkResult = board => {
    let vertical = [1, 1, 1];
    let diagonal = [1, 1];

    for(let v = 0; v < 3; v++){
        let horizontal = 1;

        for(let h = 0; h < 3; h++){
            let value = board[h + v*3];

            horizontal *= value;
            vertical[h] *= value;

            if(v === h)
                diagonal[0] *= value;
            if(v+h === 2)
                diagonal[1] *= value;
        }

        if(horizontal === 1 || horizontal === 8)
            return Math.cbrt(horizontal);
    }

    for(let i = 0; i < 3; i++)
        if(vertical[i] === 1 || vertical[i] === 8)
            return Math.cbrt(vertical[i]);

    for(let i = 0; i < 2; i++)
        if(diagonal[i] === 1 || diagonal[i] === 8)
            return Math.cbrt(diagonal[i]);

    return turn > 8 ? -1 : 0;
};

const getNPCMove = () => {
    let index = -1;
    while(index === -1){
        let guess = Math.floor(Math.random() * 9);
        if(slots[guess] === 0)
            index = guess;
    }
    return index;
};

/** Game State Commits */
const resetBoard = () => {
    slots = [   0, 0, 0,
                0, 0, 0,
                0, 0, 0  ];
    turn = 0;
    matchWinner = 0;
};

const resetGame = () => {
    resetBoard();
    player.life = 3;
    boss.life = 3;
    gameOver = false;
};

const endGame = () => {
    resetBoard();
    gameOver = true;

    setTimeout(() => resetGame(), 5000);
};

const endMatch = winner => {
    if(winner === 1)
        boss.life -= 1;
    else if(winner === 2)
        player.life -= 1;

    if(boss.life <= 0 || player.life <= 0){
        endGame();
        return;
    }

    matchWinner = winner;

    setTimeout(() => resetBoard(), 2000);
};

const makeNPCMove = () => {
    const boardIndex = getNPCMove();
    markBoard(boardIndex);
};

const markBoard = boardIndex => {
    slots[boardIndex] = turn % 2 === 0 ? 1 : 2;

    turn += 1;

    const result = checkResult(slots);

    if(result !== 0)
        endMatch(result);
    
    else if(turn % 2 !== 0)
        setTimeout(() => makeNPCMove(), Math.random() * 501 + 500);
};

/** Events */
const onMouseClick = event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(x < gameSize.x && y < gameSize.y) {
        if(turn % 2 !== 0 || turn > 8 || matchWinner !== 0 || gameOver === true)
            return;

        const square = getSelectedSquare(x, y);
        const boardIndex = square.x + square.y*3;

        if(slots[boardIndex] === 0)
            markBoard(boardIndex);
    }
};

/** Draw */
const configText = (color = "white", font = "100px Arial", textBaseline = "middle", textAlign = "center") => {
    ctx.strokeStyle = color;
    ctx.font = font;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;
};

const drawLine = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const drawBoard = () => {
    drawLine(0, cellSize.y, gameSize.x, cellSize.y);
    drawLine(0, cellSize.y * 2, gameSize.x, cellSize.y * 2);
    drawLine(cellSize.x, 0, cellSize.x, gameSize.y);
    drawLine(cellSize.x * 2, 0, cellSize.x * 2, gameSize.y);
    drawLine(0, gameSize.y, canvas.width, gameSize.y);
};

const drawText = (text, x, y) => {
    ctx.strokeText(text, x, y);
};

const drawXY = () => {
    for(let i = 0; i < 9; i++)
        if(slots[i] !== 0) {
            let y = Math.floor(i / 3);
            let x = i - y * 3;
            drawText(slots[i] === 1 ? "X" : "0", cellSize.x * (0.5 + x), cellSize.y * (0.5 + y));
        }   
};

const drawPanel = () => {
    if(gameOver === true){
        ctx.textBaseline = "middle";

        let msg = player.life <= 0 ? `${player.name} was Defeated!` : `${boss.name} was Defeated!`;
        drawText(msg, gameSize.x / 2, gameSize.y + panelSize.y / 2);
    }

    else if(matchWinner !== 0){
        ctx.textBaseline = "middle";

        let msg = matchWinner === 1 ? `${player.name} Won!` : (matchWinner === 2 ? `${boss.name} Won!` : "It's a Draw!");
        drawText(msg, gameSize.x / 2, gameSize.y + panelSize.y / 2);
    }

    else {
        drawText(player.name, gameSize.x / 4, gameSize.y + panelSize.y / 10);
        drawText(boss.name, gameSize.x * 3 / 4, gameSize.y + panelSize.y / 10);
    
        ctx.textBaseline = "middle";
        drawText("x", panelSize.x / 2, gameSize.y + panelSize.y / 2);

        let playerLifeSize = player.life / 3 * cellSize.x;
        let bossLifeSize = boss.life / 3 * cellSize.x;

        ctx.fillStyle = "white";
        ctx.fillRect(gameSize.x / 4 - cellSize.x / 2, gameSize.y + panelSize.y / 2 + 5, playerLifeSize, 20);
        ctx.fillRect(gameSize.x * 3 / 4 - cellSize.x / 2, gameSize.y + panelSize.y / 2 + 5, bossLifeSize, 20);

        ctx.fillStyle = "black";
        ctx.fillRect(gameSize.x / 4 - cellSize.x / 2 + playerLifeSize, gameSize.y + panelSize.y / 2 + 5, cellSize.x - playerLifeSize, 20);
        ctx.fillRect(gameSize.x * 3 / 4 - cellSize.x / 2 + bossLifeSize, gameSize.y + panelSize.y / 2 + 5, cellSize.x - bossLifeSize, 20);
    }
};

/** Game Loop */
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Game
    configText("white", "100px Arial", "middle", "center");
    drawBoard();
    drawXY();

    //Panel
    configText("white", "30px Arial", "top", "center");
    drawPanel();

    requestAnimationFrame(draw);
}

/** Game State */
let slots = [   0, 0, 0,
                0, 0, 0,
                0, 0, 0  ];
let turn = 0;
let matchWinner = 0;
let gameOver = false;

/** Listeners */
canvas.addEventListener("click", onMouseClick);

/** Start Game */
draw();