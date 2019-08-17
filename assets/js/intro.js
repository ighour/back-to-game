GAME.instances.intro = {};

(function config(){
    /** Variables */
    let _startPosition = {
        x: GAME.canvas.width / 2 - 70,
        y: GAME.canvas.height * 5 / 6 - 30,
        width: 140,
        height: 60
    };

    /** UI */

    /** Events */
    let _click = (event, x, y) => {
        //Start Button
        if(x > _startPosition.x && x < _startPosition.x + _startPosition.width && y > _startPosition.y && y < _startPosition.y + _startPosition.height)
            GAME.next("tictactoe");
    };

    /** Helper Functions */

    /** State Functions */

    /** Draw Functions */

    /** Game Loop */
    let _start = () => {  
        //Title
        GAME.draw.fillText("Back To #", GAME.canvas.width / 2, GAME.canvas.height / 5, {font: "100px Arial"});

        //Brief
        GAME.draw.fillText("Welcome to a journey back through time", GAME.canvas.width / 2, GAME.canvas.height * 2 / 5);
        GAME.draw.fillText("where some games were corrupted.", GAME.canvas.width / 2, GAME.canvas.height * 2 / 5 + 70);
        GAME.draw.fillText("Now only a true gamer", GAME.canvas.width / 2, GAME.canvas.height * 2 / 5 + 140);
        GAME.draw.fillText("can proceed!", GAME.canvas.width / 2, GAME.canvas.height * 2 / 5 + 210);
    
        //Start Game
        GAME.draw.fillText("Start", _startPosition.x + _startPosition.width / 2, _startPosition.y + _startPosition.height / 2);
        GAME.draw.strokeRect(_startPosition.x, _startPosition.y, _startPosition.width, _startPosition.height);
    };

    /** Game Functions */
    GAME.instances.intro.start = () => {
        GAME.events.addClick(_click);
        GAME.start(_start)
    };
    GAME.instances.intro.stop = () => GAME.stop();
})();