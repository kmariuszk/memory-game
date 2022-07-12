class Card {

    // Constructor of Card object
    constructor(id, imagePath) {
        this.id = id;
        this.imagePath = imagePath;
        this.element = document.getElementById('card' + id);
        this.available = true;

        this.secrete();
    }

    // Function used to display the image of the card 
    reveal() {
        this.available = false;
        this.element.src = this.imagePath;
    };

    // Function used to display the deck of the card
    secrete() {
        this.available = true;
        this.element.src = "images/card_deck.jpg";
    };

    // Function used to lock the card when its image is being displayed, used once a player finds a pair
    hide() {
        this.available = false;
    };

    // Function returns whether chosen card can be picked
    availability() {
        return this.available;
    };

    // Compares images of two cards
    equals(toCompare) {
        return this.imagePath == toCompare.imagePath;
    };
}
