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

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/** Helpers */
const getSelectedSquare = (x, y) => {
    return {
        x: Math.floor(x / cellSize.x),
        y: Math.floor(y / cellSize.y)
    };
};

const checkResult = compareBoard => {
    for(let i = 0; i < winCombos.length; i++){
        let winCombo = winCombos[i];

        let result = winCombo.reduce((carrier, boardIndex) => {
            carrier *= compareBoard[boardIndex];
            return carrier;
        }, 1);

        if(result === 1)
            return 1;
        else if(result === 8)
            return 2;
    }

    return turn > 8 ? -1 : 0;
};

const getNPCMove = () => {
    const random = [];
    const lose = [];

    for(let i = 0; i < 9; i++){
        if(board[i] === 0){
            let nextBoard = board.slice(0);

            nextBoard[i] = 2;
            if(checkResult(nextBoard) === 2)
                return i;

            nextBoard[i] = 1;
            if(checkResult(nextBoard) === 1)
                lose.push(i);
            else
                random.push(i);
        }
    }

    if(lose.length > 0)
        return lose[0];

    return random[Math.floor(Math.random() * random.length)];
};

/** Game State Commits */
const resetBoard = () => {
    board = [   0, 0, 0,
                0, 0, 0,
                0, 0, 0  ];
    turn = 0;
    playing = Math.floor(Math.random() * 2) + 1;
    matchWinner = 0;

    if(playing === 2)
        makeNPCMove();
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
    board[boardIndex] = playing;

    turn += 1;
    playing = playing === 1 ? 2 : 1;

    const result = checkResult(board);

    if(result !== 0)
        endMatch(result);
    
    else if(playing === 2)
        setTimeout(() => makeNPCMove(), Math.random() * 501 + 500);
};

/** Events */
const onMouseClick = event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(x < gameSize.x && y < gameSize.y) {
        if(playing === 2 || turn > 8 || matchWinner !== 0 || gameOver === true)
            return;

        const square = getSelectedSquare(x, y);
        const boardIndex = square.x + square.y*3;

        if(board[boardIndex] === 0)
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
        if(board[i] !== 0) {
            let y = Math.floor(i / 3);
            let x = i - y * 3;
            drawText(board[i] === 1 ? "X" : "0", cellSize.x * (0.5 + x), cellSize.y * (0.5 + y));
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

        if(playing === 1)
            drawText(">", gameSize.x / 20, gameSize.y + panelSize.y / 4);
        else
            drawText("<", gameSize.x * 19 / 20, gameSize.y + panelSize.y / 4);
    
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
let board, turn, playing, matchWinner;
resetBoard();
let gameOver = false;

/** Listeners */
canvas.addEventListener("click", onMouseClick);

/** Start Game */
draw();