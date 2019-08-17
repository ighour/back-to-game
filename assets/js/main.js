let game;

const player = {
    name: "John Doe",
    life: 3
};

/** Intro */
const introCallback = () => {
    game.stop();

    game = tictactoe(player, ticTacToeCallback);
    game.start();
};

/** Tic-Tac-Toe */
const ticTacToeCallback = result => {
    game.stop();
}

/** Start */
game = intro(player, introCallback);
game.start();