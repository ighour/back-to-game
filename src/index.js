require('./style.css');
const GAME = require('./app/game').default;
const INTRO = require('./app/scenes/intro').default;
const PACMAN = require('./app/scenes/games/pacman').default;
const PONG = require('./app/scenes/games/pong').default;
const TICTACTOE = require('./app/scenes/games/tictactoe').default;
const GAMEOVER = require('./app/scenes/gameover').default;

/** Game Instances */
GAME.add(INTRO);
GAME.add(PACMAN);
GAME.add(PONG);
GAME.add(TICTACTOE);
GAME.add(GAMEOVER);

/** Start */
(function BOOT(){
    if(!GAME.start())
        setTimeout(BOOT, 500);
})();