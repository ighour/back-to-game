require('./style.css');
const { GAME } = require('./app/game');

/** Game Instances */
GAME.a(require('./app/scenes/intro').INTRO);
GAME.a(require('./app/scenes/games/pacman').PACMAN);
GAME.a(require('./app/scenes/games/pong').PONG);
GAME.a(require('./app/scenes/games/tictactoe').TICTACTOE);
GAME.a(require('./app/scenes/games/chess').CHESS);
GAME.a(require('./app/scenes/gameover').GAMEOVER);

/** Start */
(function BOOT(){
    if(!GAME.s())
        setTimeout(BOOT, 500);
})();