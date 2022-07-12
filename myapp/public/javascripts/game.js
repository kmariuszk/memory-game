const cardsImagesPaths = ["images/card0.jpg", "images/card1.jpg", "images/card2.jpg", "images/card3.jpg", "images/card4.jpg", "images/card5.jpg", "images/card6.jpg", "images/card7.jpg"];

class Game {
    constructor() {
        this.cards = [];
        this.revealed = [];
        this.turn = 0;
        this.gameStart = false;
        this.you = null;
        this.opponent = null;
        console.log("New game created!");
    }

    initialize(imagesArray) {
        for (let i = 0; i < 16; i++) {
            cards.push(new Card(i, cardsImagesPaths[imagesArray[i] % 8]));
        }
        this.gameStart = true;
    }

    gameStarted() {
        return this.gameStart;
    }

    assignPlayer(playerType) {
        if (playerType == 'A') {
            this.you = new Player('A', 'player0');
            this.opponent = new Player('B', 'player1');
        } else {
            this.you = new Player('B', 'player0');
            this.opponent = new Player('A', 'player1');
        }
    }

    cardAvailable(id) {
        return this.cards[id].availability();
    }

    canPickMoreCards() {
        return !(this.revealed.length == 2);
    }

    isItMineTurn() {
        // Player A's turn is when it's even numbered turn
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

    revealCard(cardNumber) {
        this.cards[cardNumber].reveal();
        this.revealed.push(cards[cardNumber]);

        if (this.revealed.length == 2) {
            if (this.revealed[0].equals(this.revealed[1])) {
                this.revealed.forEach(card => {
                    card.hide();
                });

                // ADD POINTS FOR PLAYERS, temporarily turnt off

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
    }


}