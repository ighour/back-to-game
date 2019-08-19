const GAME = require('./main').default;

/** Variables */
let win = false;

/** UI */
let newGame = {
    x: GAME.canvas.width / 2 - 180,
    y: GAME.canvas.height * 2 / 3,
    width: 360,
    height: 60
};

/** Events */
let click = (event, x, y) => {
    //New Game
    if(x > newGame.x && x < newGame.x + newGame.width && y > newGame.y && y < newGame.y + newGame.height){
        reset();
        GAME.next("intro");
    }
};

/** Helper Functions */
let reset = () => {
    GAME.player.name = "";
    GAME.player.life = 100;
    GAME.next("intro");
};

/** State Functions */

/** Draw Functions */
let drawWin = () => {
    GAME.draw.fillText("You defeated all Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
};

let drawLose = () => {
    GAME.draw.fillText("You were defeated by Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
};

/** Game Loop */
let start = () => {  
    if(win)
        drawWin();
    else
        drawLose();

    //New Game
    GAME.draw.fillText("Back to Future", newGame.x + newGame.width / 2, newGame.y + newGame.height / 2);
    GAME.draw.strokeRect(newGame.x, newGame.y, newGame.width, newGame.height);
};

export default {
    start: _win => {
        GAME.events.addClick(click);
        win = _win;
        GAME.start(start)
    },
    stop: () => {
        win = false;
        GAME.stop()
    }
};