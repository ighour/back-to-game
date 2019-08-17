GAME.instances.gameover = {};

(function config(){
    /** Variables */
    let _win = false;

    /** UI */
    let _newGame = {
        x: GAME.canvas.width / 2 - 180,
        y: GAME.canvas.height * 2 / 3,
        width: 360,
        height: 60
    };

    /** Events */
    let _click = (event, x, y) => {
        //New Game
        if(x > _newGame.x && x < _newGame.x + _newGame.width && y > _newGame.y && y < _newGame.y + _newGame.height){
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
    drawWin = () => {
        GAME.draw.fillText("You defeated all Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
    };

    drawLose = () => {
        GAME.draw.fillText("You were defeated by Evil Games!", GAME.canvas.width / 2, GAME.canvas.height / 3);
    };

    /** Game Loop */
    let _start = () => {  
        if(_win)
            drawWin();
        else
            drawLose();

        //New Game
        GAME.draw.fillText("Back to Future", _newGame.x + _newGame.width / 2, _newGame.y + _newGame.height / 2);
        GAME.draw.strokeRect(_newGame.x, _newGame.y, _newGame.width, _newGame.height);
    };

    /** Game Functions */
    GAME.instances.gameover.start = (win = false) => {
        GAME.events.addClick(_click);
        _win = win;
        GAME.start(_start)
    };
    GAME.instances.gameover.stop = () => {
        _win = false;
        GAME.stop()
    };
})();