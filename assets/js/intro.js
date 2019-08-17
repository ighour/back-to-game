GAME.instances.intro = {};

(function config(){
    /** Variables */

    /** UI */

    /** Events */
    let _click = (event, x, y) => {
        //Start Button
        if(x > GAME.canvas.width / 2 - 60 && x < GAME.canvas.width / 2 + 60 && y > GAME.canvas.height * 2 / 3 - 30 && y < GAME.canvas.height * 2 / 3 + 30)
            GAME.next("tictactoe");
    };

    /** Helper Functions */

    /** State Functions */

    /** Draw Functions */

    /** Game Loop */
    let _start = () => {  
        //Title
        GAME.draw.text("Back To #", GAME.canvas.width / 2, GAME.canvas.height / 4, {font: "100px Arial"});
    
        //Start Game
        GAME.draw.text("Start", GAME.canvas.width / 2, GAME.canvas.height * 2 / 3);
        GAME.draw.strokeRect(GAME.canvas.width / 2 - 70, GAME.canvas.height * 2 / 3 - 30, 140, 60);
    };

    /** Game Functions */
    GAME.instances.intro.start = () => {
        GAME.events.addClick(_click);
        GAME.start(_start)
    };
    GAME.instances.intro.stop = () => GAME.stop();
})();