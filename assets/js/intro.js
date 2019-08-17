GAME.instances.intro = {};

(function config(){
    /** Variables */
    let _UI = document.querySelector("#game");
    let _nameInput;
    let _creating = false;

    /** UI */
    let _startPosition = {
        x: GAME.canvas.width / 2 - 180,
        y: GAME.canvas.height * 5 / 6 - 30,
        width: 360,
        height: 60
    };

    /** Events */
    let _click = (event, x, y) => {
        //Start Button
        if(_creating === false && x > _startPosition.x && x < _startPosition.x + _startPosition.width && 
            y > _startPosition.y && y < _startPosition.y + _startPosition.height){
            _creating = true;
            makeNameInput();
        }
    };

    /** Helper Functions */
    let makeNameInput = () => {
        _nameInput = document.createElement("div");
        _nameInput.style.position = "relative";
        _nameInput.style.top = (-1 * GAME.canvas.height / 3) + "px";

        let input = document.createElement("input");
        input.type = "text";
        input.maxLength = 8;
        input.autofocus = true;
        input.style.width = "240px";
        input.style.height = "60px";
        input.style.fontSize = "40pt";
        input.style.margin = "0";
        input.style.padding = "0";
        _nameInput.appendChild(input);

        let submit = document.createElement("input");
        submit.type = "submit";
        submit.value = ">";
        submit.style.width = "40px";
        submit.style.height = "64px";
        submit.style.fontSize = "40pt";
        submit.style.margin = "1px 0 0 0";
        submit.style.padding = "0";
        _nameInput.appendChild(submit);
  
        _UI.appendChild(_nameInput);

        submit.addEventListener("click", event => {
            if(input.value.length > 0)
                beginGame(input.value);
        });
    };

    let beginGame = name => {
        GAME.player.name = name;
        _UI.removeChild(_nameInput);
        GAME.next("tictactoe");
    };

    /** State Functions */

    /** Draw Functions */
    let drawNew = () => {
        //Title
        GAME.draw.fillText("Back To #", GAME.canvas.width / 2, GAME.canvas.height / 5, {font: "100px Arial"});

        //Brief
        let texts = [
            "Welcome to a journey back through time",
            "where some games were corrupted.",
            "Now only a true gamer",
            "can proceed!"
        ];
        GAME.draw.fillTextBlock(texts, GAME.canvas.width / 2, GAME.canvas.height * 2 / 5, 70);

        //Start Game
        GAME.draw.fillText("Start Challenge", _startPosition.x + _startPosition.width / 2, _startPosition.y + _startPosition.height / 2);
        GAME.draw.strokeRect(_startPosition.x, _startPosition.y, _startPosition.width, _startPosition.height);
    };

    let drawCreate = () => {
        //Call
        let texts = [
            "What is your name,",
            "Hero?"
        ];
        GAME.draw.fillTextBlock(texts, GAME.canvas.width / 2, GAME.canvas.height / 3, 70);
    };

    /** Game Loop */
    let _start = () => {  
        if(_creating === false)
            drawNew();
        else
            drawCreate();  
    };

    /** Game Functions */
    GAME.instances.intro.start = () => {
        GAME.events.addClick(_click);
        GAME.start(_start)
    };
    GAME.instances.intro.stop = () => {
        _creating = false;
        GAME.stop()
    };
})();