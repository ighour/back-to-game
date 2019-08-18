const GAME = require('./app/main').default;
const INTRO = require('./app/intro').default;
const TICTACTOE = require('./app/tictactoe').default;
const PONG = require('./app/pong').default;
const GAMEOVER = require('./app/gameover').default;
require('./style.css');

// Initialize modules
GAME.instances.intro = INTRO;
GAME.instances.tictactoe = TICTACTOE;
GAME.instances.pong = PONG;
GAME.instances.gameover = GAMEOVER;

// Start
(function BOOT(){
    if(GAME.instances[GAME.current] === undefined)
        setTimeout(BOOT, 500);
    else
        GAME.instances[GAME.current].start();
})();