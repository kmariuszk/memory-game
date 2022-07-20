const websocket = require("ws");

/**
 * Game class contains information about the Memory Game between two users.
 */
class Game {

    /**
     * Construct a Game object.
     * 
     * @param  {integer} id - the id of the game. 
     */
    constructor(id) {
        this.id = id;
        this.playerA = null;
        this.playerB = null;
        this.cardImagePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this.shuffle();
        this.gameState = "0 JOINT";
    }

    /*
    * All valid transition states are keys of the transitionStates object.
    */
    transitionStates = {
        "0 JOINT": 0,
        "1 JOINT": 1,
        "2 JOINT": 2,
        "FINISHED": 3,
        "ABORTED": 4
    };

    /*
    * Not all game states can be transformed into each other; the transitionMatrix object encodes the valid transitions.
    * Valid transitions have a value of 1. Invalid transitions have a value of 0.
    */
    transitionMatrix = [
        [0, 1, 0, 0, 0], //0 JOINT
        [1, 0, 1, 0, 0], //1 JOINT
        [0, 0, 0, 1, 1], //2 JOINT (note: once we have two players, there is no way back!)
        [0, 0, 0, 0, 0], //FINISHED
        [0, 0, 0, 0, 0]  //ABORTED
    ];

    /**
     * Determines whether the transition from state `from` to `to` is valid.
     * @param {string} from starting transition state
     * @param {string} to ending transition state
     * @returns {boolean} true if the transition is valid, false otherwise
     */
    isValidTransition = function (from, to) {
        let i, j;
        if (!(from in this.transitionStates)) {
            return false;
        } else {
            i = this.transitionStates[from];
        }

        if (!(to in this.transitionStates)) {
            console.log(to);
            return false;
        } else {
            j = this.transitionStates[to];
        }

        return this.transitionMatrix[i][j] > 0;
    };

    /**
     * Determines whether the state `s` is valid.
     * @param {string} s state to check
     * @returns {boolean}
     */
    isValidState = function (s) {
        return s in this.transitionStates;
    };

    /**
     * Updates the game status to `w` if the state is valid and the transition to `w` is valid.
     * @param {string} w new game status
     */
    setStatus = function (w) {
        if (
            this.isValidState(w) &&
            this.isValidTransition(this.gameState, w)
        ) {
            this.gameState = w;
            console.log("[STATUS] %s", this.gameState);
        } else {
            return new Error(
                `Impossible status change from ${this.gameState} to ${w}`
            );
        }
    };


    /**
     * Adds a player to the game.
     * 
     * @param  {WebSocket} p - socket of a player. 
     */
    addPlayer(p) {
        if (this.gameState == "0 JOINT") {
            this.playerA = p;
            this.setStatus("1 JOINT");
            return 'A';
        } else {
            this.playerB = p;
            this.setStatus("2 JOINT");
            return 'B';
        }
    };


    /**
     * Returns whether two players are in the game.
     */
    hasTwoConnectedPlayers() {
        return this.gameState == "2 JOINT";
    }

    /**
     * Shuffles the cardImagePosition array which creates new deck of the cards.
     */
    shuffle() {
        this.cardImagePosition.sort((a, b) => Math.random() - 0.5);
    }
}

module.exports = Game;