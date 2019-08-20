require('./style.css');

const GAME = require('./app/main').default;
const INTRO = require('./app/intro').default;
const PONG = require('./app/pong').default;
const TICTACTOE = require('./app/tictactoe').default;
const GAMEOVER = require('./app/gameover').default;

// Add Instances
GAME.add(INTRO);
GAME.add(PONG);
GAME.add(TICTACTOE);
GAME.add(GAMEOVER);

// Start
(function BOOT(){
    if(!GAME.start())
        setTimeout(BOOT, 500);
})();