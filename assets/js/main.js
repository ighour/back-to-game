const GAME = {};

(function config(){
    /** Variables */
    let _canvas = document.querySelector("canvas");
    let _ctx = _canvas.getContext("2d");
    let _events = {
        click: []
    };
    let _gameDraw;
    let _animationFrame;
    let _ctxStyle = {
        fillStyle: "white",
        strokeStyle: "white",
        font: "50px Arial",
        textAlign: "center",
        textBaseline: "middle"
    };

    /** Canvas Config */
    _canvas.width = 1024;
    _canvas.height = 768;
    GAME.canvas = {
        x: 0,
        y: 0,
        width: _canvas.width,
        height: _canvas.height
    };

    /** Context Config */
    _ctx.lineWidth = 2;

    /** Game Config */
    GAME.current = "intro";
    GAME.instances = {};
    GAME.player = {
        name: "John Doe",
        life: 100,
        damage: 25
    };

    /** Events */
    GAME.events = {};
    GAME.events.addClick = event => _events.click.push(event);
    _canvas.addEventListener("click", event => {
        let rect = _canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        _events.click.forEach(e => e(event, x, y));
    });

    /** Draw Functions */
    let _tempStyleAction = (callback, styles) => {
        if(styles) GAME.draw.styles(styles);
        callback();
        if(styles) GAME.draw.styles(_ctxStyle);
    };
    let _clearCanvas = () => _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    GAME.draw = {};
    GAME.draw.styles = ({fillStyle, strokeStyle, font, textAlign, textBaseline}) => {
        if(fillStyle) _ctx.fillStyle = fillStyle;
        if(strokeStyle) _ctx.strokeStyle = strokeStyle;
        if(font) _ctx.font = font;
        if(textAlign) _ctx.textAlign = textAlign;
        if(textBaseline) _ctx.textBaseline = textBaseline;
    };
    GAME.draw.line = (x1, y1, x2, y2, styles) => {
        _tempStyleAction(() => {
            _ctx.beginPath();
            _ctx.moveTo(x1, y1);
            _ctx.lineTo(x2, y2);
            _ctx.stroke();
        }, styles);
    };
    GAME.draw.text = (text, x, y, styles) => {
        _tempStyleAction(() => _ctx.strokeText(text, x, y), styles);
    };
    GAME.draw.fillRect = (x, y, width, height, styles) => {
        _tempStyleAction(() => _ctx.fillRect(x, y, width, height), styles);
    };
    GAME.draw.strokeRect = (x, y, width, height, styles) => {
        _tempStyleAction(() => _ctx.strokeRect(x, y, width, height), styles);
    };

    /** Game Functions */
    let _start = () => {
        _clearCanvas();
        _gameDraw();
        _animationFrame = requestAnimationFrame(_start);
    };
    let _reset = () => {
        GAME.player = {
            name: "John Doe",
            life: 100,
            damage: 100
        };
        GAME.next("intro");
    };
    GAME.start = gameDraw => {
        GAME.draw.styles(_ctxStyle);
        _gameDraw = gameDraw;
        _start();
    };
    GAME.stop = () => {
        cancelAnimationFrame(_animationFrame);
        _events.click = [];
        _gameDraw = null;
        _clearCanvas();
    };
    GAME.next = name => {
        GAME.instances[GAME.current].stop();
        GAME.current = name;
        GAME.instances[GAME.current].start();
    };
    GAME.gameOver = win => {
        if(!win) {
            alert("You are dead!");
            _reset();
            return;
        }
        
        alert("You won!");
        switch(GAME.current){
            case "tictactoe":
                GAME.next("intro");
            break;
        }
    };
})();

// Initialize game
(function BOOT(){
    if(GAME.instances[GAME.current] === undefined)
        setTimeout(BOOT, 500);
    else
        GAME.instances[GAME.current].start();
})();