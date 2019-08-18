const GAME = require('./main').default;

/** Variables */
let boss = {
    name: "Evil Tic",
    life: 100,
    damage: 25
};
let winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let turn = 0;
let board = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0 
];
let matchWinner = 0;
let playing;
let gameOver = false;

/** UI */
let gamePosition = {
    x: GAME.canvas.width / 5,
    y: GAME.canvas.height / 10,
    width: GAME.canvas.width * 3 / 5,
    height: GAME.canvas.height * 3 / 5
};
let cellSize = {
    x: gamePosition.width  / 3,
    y: gamePosition.height / 3 
};
let panelPosition = {
    x: 0,
    y: gamePosition.y + gamePosition.height + 20,
    width: GAME.canvas.width,
    height: GAME.canvas.height - (gamePosition.y + gamePosition.height + 20) - 1
};

/** Events */
let click = (event, x, y) => {
    if(x > gamePosition.x && x < gamePosition.x + gamePosition.width && y > gamePosition.y && y < gamePosition.y + gamePosition.height) {
        if(playing === 2 || turn > 8 || matchWinner !== 0 || gameOver === true)
            return;

        let square = getSelectedSquare(x, y);
        let boardIndex = square.x + square.y*3;

        if(board[boardIndex] === 0)
            markBoard(boardIndex);
    }
};

/** Helper Functions */
let getSelectedSquare = (x, y) => {
    return {
        x: Math.floor((x - gamePosition.x) / cellSize.x),
        y: Math.floor((y - gamePosition.y) / cellSize.y)
    };
};

let checkResult = compareBoard => {
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

let getNPCMove = () => {
    let lose = [];
    let random = [];

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

/** State Functions */
let resetBoard = () => {
    turn = 0;
    board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0  
    ];
    matchWinner = 0;
};

let startMatch = () => {
    resetBoard();

    playing = Math.floor(Math.random() * 2) + 1;

    if(playing === 2)
        makeNPCMove();
};

let onGameOver = result => {
    gameOver = true;

    setTimeout(() => {
        GAME.gameOver(result);
    }, 3000);
};

let endMatch = winner => {
    if(winner === 1)
        boss.life -= GAME.player.damage;
    else if(winner === 2)
        GAME.player.life -= boss.damage;

    if(boss.life <= 0 || GAME.player.life <= 0){
        onGameOver(boss.life <= 0 ? true : false);
        return;
    }

    matchWinner = winner;

    setTimeout(() => startMatch(), 2000);
};

let makeNPCMove = () => {
    let boardIndex = getNPCMove();

    setTimeout(() => markBoard(boardIndex), 500);
};

let markBoard = boardIndex => {
    board[boardIndex] = playing;

    turn += 1;
    playing = playing === 1 ? 2 : 1;

    let result = checkResult(board);

    if(result !== 0)
        endMatch(result);
    
    else if(playing === 2)
        setTimeout(() => makeNPCMove(), Math.random() * 501 + 500);
};

/** Draw Functions */
let drawBoard = () => {
    GAME.draw.line(gamePosition.x, gamePosition.y + cellSize.y, gamePosition.x + gamePosition.width, gamePosition.y + cellSize.y);
    GAME.draw.line(gamePosition.x, gamePosition.y + cellSize.y * 2, gamePosition.x + gamePosition.width, gamePosition.y + cellSize.y * 2);
    GAME.draw.line(gamePosition.x + cellSize.x, gamePosition.y, gamePosition.x + cellSize.x, gamePosition.y + gamePosition.height);
    GAME.draw.line(gamePosition.x + cellSize.x * 2, gamePosition.y, gamePosition.x + cellSize.x * 2, gamePosition.y + gamePosition.height);
};

let drawXY = () => {
    for(let i = 0; i < 9; i++)
        if(board[i] !== 0) {
            let y = Math.floor(i / 3);
            let x = i - y * 3;
            GAME.draw.fillText(board[i] === 1 ? "X" : "0", gamePosition.x + cellSize.x * (0.5 + x), gamePosition.y + cellSize.y * (0.5 + y));
        }   
};

let drawGameOver = () => {
    let msg = GAME.player.life <= 0 ? `${GAME.player.name} was Defeated!` : `${boss.name} was Defeated!`;
    GAME.draw.fillText(msg, panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2);
};

let drawMatchResult = () => {
    let msg = matchWinner === 1 ? `${GAME.player.name} Won!` : (matchWinner === 2 ? `${boss.name} Won!` : "It's a Draw!");
    GAME.draw.fillText(msg, panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height / 2);
};

let drawBasePanel = () => {
    // Names
    GAME.draw.fillText(GAME.player.name, panelPosition.x + panelPosition.width / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});
    GAME.draw.fillText(boss.name, panelPosition.x + panelPosition.width * 3 / 4, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});

    // Turn
    GAME.draw.fillText("x", panelPosition.x + panelPosition.width / 2, panelPosition.y + panelPosition.height - 20, {textBaseline: "bottom"});

    if(playing === 1)
        GAME.draw.fillText("<", panelPosition.x + panelPosition.width / 2 - 40, panelPosition.y + panelPosition.height - 17, {textBaseline: "bottom"});
    else
        GAME.draw.fillText(">", panelPosition.x + panelPosition.width / 2 + 40, panelPosition.y + panelPosition.height - 17, {textBaseline: "bottom"});

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
    else if(matchWinner !== 0)
        drawMatchResult();    
    else
        drawBasePanel();
};

/** Game Loop */
let start = () => {  
    //Game
    drawBoard();
    drawXY();

    //Panel
    drawPanel();
};

export default {
    start: () => {
        GAME.events.addClick(click);
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