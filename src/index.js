require('./style.css');
const { GAME } = require('./app/game');
const { INTRO } = require('./app/scenes/intro');
const { PACMAN } = require('./app/scenes/games/pacman');
const { PONG } = require('./app/scenes/games/pong');
const { TICTACTOE } = require('./app/scenes/games/tictactoe');
const { GAMEOVER } = require('./app/scenes/gameover');

/** Game Instances */
GAME.a(INTRO);
GAME.a(PACMAN);
GAME.a(PONG);
GAME.a(TICTACTOE);
GAME.a(GAMEOVER);

/** Start */
(function BOOT(){
    if(!GAME.s())
        setTimeout(BOOT, 500);
})();