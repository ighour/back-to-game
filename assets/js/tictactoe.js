GAME.instances.tictactoe = {};

(function config(){
    /** Variables */
    let _boss = {
        name: "Evil Tic",
        life: 100,
        damage: 25
    };
    let _winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let _turn = 0;
    let _board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0 
    ];
    let _matchWinner = 0;
    let _playing;
    let _gameOver = false;

    /** UI */
    let _gamePosition = {
        x: GAME.canvas.width / 5,
        y: GAME.canvas.height / 10,
        width: GAME.canvas.width * 3 / 5,
        height: GAME.canvas.height * 3 / 5
    };
    let _cellSize = {
        x: _gamePosition.width  / 3,
        y: _gamePosition.height / 3 
    };
    let _panelPosition = {
        x: 0,
        y: _gamePosition.y + _gamePosition.height + 20,
        width: GAME.canvas.width,
        height: GAME.canvas.height - (_gamePosition.y + _gamePosition.height + 20) - 1
    };

    /** Events */
    let _click = (event, x, y) => {
        if(x > _gamePosition.x && x < _gamePosition.x + _gamePosition.width && y > _gamePosition.y && y < _gamePosition.y + _gamePosition.height) {
            if(_playing === 2 || _turn > 8 || _matchWinner !== 0 || _gameOver === true)
                return;
    
            let square = getSelectedSquare(x, y);
            let boardIndex = square.x + square.y*3;
    
            if(_board[boardIndex] === 0)
                markBoard(boardIndex);
        }
    };

    /** Helper Functions */
    let getSelectedSquare = (x, y) => {
        return {
            x: Math.floor((x - _gamePosition.x) / _cellSize.x),
            y: Math.floor((y - _gamePosition.y) / _cellSize.y)
        };
    };

    let checkResult = compareBoard => {
        for(let i = 0; i < _winCombos.length; i++){
            let winCombo = _winCombos[i];
    
            let result = winCombo.reduce((carrier, boardIndex) => {
                carrier *= compareBoard[boardIndex];
                return carrier;
            }, 1);
    
            if(result === 1)
                return 1;
            else if(result === 8)
                return 2;
        }
    
        return _turn > 8 ? -1 : 0;
    };

    let getNPCMove = () => {
        let lose = [];
        let random = [];
    
        for(let i = 0; i < 9; i++){
            if(_board[i] === 0){
                let nextBoard = _board.slice(0);
    
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
        _turn = 0;
        _board = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0  
        ];
        _matchWinner = 0;
    };

    let startMatch = () => {
        resetBoard();
    
        _playing = Math.floor(Math.random() * 2) + 1;
    
        if(_playing === 2)
            makeNPCMove();
    };

    let onGameOver = result => {
        _gameOver = true;
    
        setTimeout(() => {
            GAME.instances.tictactoe.stop();
            console.log("GAMEOVER")
        }, 3000);
    };

    let endMatch = winner => {
        if(winner === 1)
            _boss.life -= GAME.player.damage;
        else if(winner === 2)
            GAME.player.life -= _boss.damage;
    
        if(_boss.life <= 0 || GAME.player.life <= 0){
            onGameOver(_boss.life <= 0 ? true : false);
            return;
        }
    
        _matchWinner = winner;
    
        setTimeout(() => startMatch(), 2000);
    };

    let makeNPCMove = () => {
        let boardIndex = getNPCMove();

        setTimeout(() => markBoard(boardIndex), 500);
    };

    let markBoard = boardIndex => {
        _board[boardIndex] = _playing;

        _turn += 1;
        _playing = _playing === 1 ? 2 : 1;

        let result = checkResult(_board);

        if(result !== 0)
            endMatch(result);
        
        else if(_playing === 2)
            setTimeout(() => makeNPCMove(), Math.random() * 501 + 500);
    };

    /** Draw Functions */
    let drawBoard = () => {
        GAME.draw.line(_gamePosition.x, _gamePosition.y + _cellSize.y, _gamePosition.x + _gamePosition.width, _gamePosition.y + _cellSize.y);
        GAME.draw.line(_gamePosition.x, _gamePosition.y + _cellSize.y * 2, _gamePosition.x + _gamePosition.width, _gamePosition.y + _cellSize.y * 2);
        GAME.draw.line(_gamePosition.x + _cellSize.x, _gamePosition.y, _gamePosition.x + _cellSize.x, _gamePosition.y + _gamePosition.height);
        GAME.draw.line(_gamePosition.x + _cellSize.x * 2, _gamePosition.y, _gamePosition.x + _cellSize.x * 2, _gamePosition.y + _gamePosition.height);
    };

    let drawXY = () => {
        for(let i = 0; i < 9; i++)
            if(_board[i] !== 0) {
                let y = Math.floor(i / 3);
                let x = i - y * 3;
                GAME.draw.text(_board[i] === 1 ? "X" : "0", _gamePosition.x + _cellSize.x * (0.5 + x), _gamePosition.y +_cellSize.y * (0.5 + y));
            }   
    };

    let drawGameOver = () => {
        let msg = GAME.player.life <= 0 ? `${GAME.player.name} was Defeated!` : `${_boss.name} was Defeated!`;
        GAME.draw.text(msg, _panelPosition.x + _panelPosition.width / 2, _panelPosition.y + _panelPosition.height / 2);
    };

    let drawMatchResult = () => {
        let msg = _matchWinner === 1 ? `${GAME.player.name} Won!` : (_matchWinner === 2 ? `${_boss.name} Won!` : "It's a Draw!");
        GAME.draw.text(msg, _panelPosition.x + _panelPosition.width / 2, _panelPosition.y + _panelPosition.height / 2);
    };

    let drawBasePanel = () => {
        // Names
        GAME.draw.text(GAME.player.name, _panelPosition.x + _panelPosition.width / 4, _panelPosition.y + _panelPosition.height - 20, {textBaseline: "bottom"});
        GAME.draw.text(_boss.name, _panelPosition.x + _panelPosition.width * 3 / 4, _panelPosition.y + _panelPosition.height - 20, {textBaseline: "bottom"});

        // Turn
        GAME.draw.text("x", _panelPosition.x + _panelPosition.width / 2, _panelPosition.y + _panelPosition.height - 20, {textBaseline: "bottom"});

        if(_playing === 1)
            GAME.draw.text("<", _panelPosition.x + _panelPosition.width / 2 - 40, _panelPosition.y + _panelPosition.height - 17, {textBaseline: "bottom"});
        else
            GAME.draw.text(">", _panelPosition.x + _panelPosition.width / 2 + 40, _panelPosition.y + _panelPosition.height - 17, {textBaseline: "bottom"});

        //Lives
        let maxSize = _panelPosition.x + _panelPosition.width / 4;
        let playerLifeSize = GAME.player.life / 100 * maxSize;
        let bossLifeSize = _boss.life / 100 * maxSize;

        GAME.draw.fillRect(_panelPosition.x + _panelPosition.width / 8, _panelPosition.y + _panelPosition.height / 2, playerLifeSize, 20);
        GAME.draw.fillRect(_panelPosition.x + _panelPosition.width / 8 + playerLifeSize, _panelPosition.y + _panelPosition.height / 2, maxSize - playerLifeSize, 20, {fillStyle: "black"});

        GAME.draw.fillRect(_panelPosition.x + _panelPosition.width * 7 / 8 - maxSize, _panelPosition.y + _panelPosition.height / 2, bossLifeSize, 20);
        GAME.draw.fillRect(_panelPosition.x + _panelPosition.width * 7 / 8 - maxSize + bossLifeSize, _panelPosition.y + _panelPosition.height / 2, maxSize - bossLifeSize, 20, {fillStyle: "black"});
    };

    let drawPanel = () => {
        if(_gameOver === true)
            drawGameOver();
        else if(_matchWinner !== 0)
            drawMatchResult();    
        else
            drawBasePanel();
    };

    /** Game Loop */
    let _start = () => {  
        //Game
        drawBoard();
        drawXY();
    
        //Panel
        drawPanel();
    };

    /** Game Functions */
    GAME.instances.tictactoe.start = () => {
        GAME.events.addClick(_click);
        startMatch();
        GAME.start(_start)
    };
    GAME.instances.tictactoe.stop = () => GAME.stop();
})();