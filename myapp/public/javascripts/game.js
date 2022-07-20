const cardsImagesPaths = ["images/card0.jpg", "images/card1.jpg", "images/card2.jpg", "images/card3.jpg", "images/card4.jpg", "images/card5.jpg", "images/card6.jpg", "images/card7.jpg"];

/**
 * Game class contains information about the Memory Game between two users on the client side.
 */
class Game {

    /**
     * Construct a Game object.
     */
    constructor() {
        this.cards = [];
        this.revealed = [];
        this.turn = 0;
        this.gameStart = false;
        this.you = null;
        this.opponent = null;
    }

    /**
     * Initializes the game object by attaching the cards to its images paths.
     * 
     * @param  {Array} imagesArray - shuffled array of images indices.
     */
    initialize(imagesArray) {
        for (let i = 0; i < 16; i++) {
            this.cards.push(new Card(i, cardsImagesPaths[imagesArray[i] % 8]));
        }
        this.gameStart = true;
    }

    /**
     * Returns whether the game has already started.
     */
    isGameStarted() {
        return this.gameStart;
    }

    /**
     * Assigns players types.
     * 
     * @param  {Character} playerType - player of the client player.
     */
    assignPlayer(playerType) {
        if (playerType == 'A') {
            this.you = new Player('A', 'player0');
            this.opponent = new Player('B', 'player1');
        } else {
            this.you = new Player('B', 'player0');
            this.opponent = new Player('A', 'player1');
        }
    }

    /**
     * Returns whether card can be picked by the player.
     * 
     * @param  {Integer} id - id of the card.
     */
    cardAvailable(id) {
        return this.cards[id].availability();
    }

    /**
     * Returns whether player can pick more cards.
     */
    canPickMoreCards() {
        return (this.revealed.length != 2);
    }

    /**
     * Returns whether player can make a move.
     */
    isItMineTurn() {
        // Player A's turn is when it's even numbered turn.
        if (this.you.getId() == 'A') {
            if (this.turn % 2 == 0) {
                return true;
            }
        } else {
            if (this.turn % 2 == 1) {
                return true;
            }
        }

        return false;
    }

    /**
     * Reveals cards image.
     * 
     * @param  {Integer} cardNumber - card id.
     */
    revealCard(cardNumber) {
        this.cards[cardNumber].reveal();
        this.revealed.push(this.cards[cardNumber]);

        if (this.revealed.length == 2) this.hideCards();
    }

    /**
     * If player picked a pair then leave cards unrevealed, otherwise reverse them again.
     */
    hideCards() {
        if (this.revealed[0].equals(this.revealed[1])) {
            this.revealed.forEach(card => {
                card.hide();
            });

            // Add a point for a player
            if (this.isItMineTurn()) {
                this.you.increasePoints();
            } else {
                this.opponent.increasePoints();
            }

            this.revealed = [];
            this.turn++;
        } else {
            setTimeout(() => {
                this.revealed.forEach(card => {
                    card.secrete();
                });
                this.revealed = [];
                this.turn++;
            }, 2000);
        }
    }


    /**
     * Returns a message to display when the game is over.
     */
    finalMessage() {
        let you = "Congratulations! You won the game!"
        let op = "The game is over! Unfortunately, you lost.";
        let draw = "It was a good game! But there's no winner, the game is drawn.";

        if (this.you.getPoints() > this.opponent.getPoints()) {
            return you;
        } else if (this.you.getPoints() == this.opponent.getPoints()) {
            return draw;
        } else {
            return op;
        }
    }
    /**
     * Return whether game is finished (all cards are unrevealed).
     */
    isFinished() {
        return this.you.getPoints() + this.opponent.getPoints() == 8;
    }
}
