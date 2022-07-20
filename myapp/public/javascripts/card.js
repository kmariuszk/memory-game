/**
 * Card class contain information about each card.
 */
class Card {

    /**
     * Construct a card object.
     * 
     * @param  {Integer} id - the id of the card.
     * @param  {String} imagePath - the path of the cards image.
     */
    constructor(id, imagePath) {
        this.id = id;
        this.imagePath = imagePath;
        this.element = document.getElementById('card' + id);
        this.available = true;

        this.secrete();
    }

    /**
     * Display the image of the card.
     */
    reveal() {
        this.available = false;
        this.element.src = this.imagePath;
    };

    /**
     * Reverse card back (display the back of the card).
     */
    secrete() {
        this.available = true;
        this.element.src = "images/card_deck.jpg";
    };

    /**
     * Lock card unrevealed (when player finds a pair).
     */
    hide() {
        this.available = false;
    };

    /** 
     * Returns whether a card can be picked.
     */
    availability() {
        return this.available;
    };

    /**
     * Compares images of two cards.
     * 
     * @param  {Card} toCompare - the other card to compare with this.
     */
    equals(toCompare) {
        return this.imagePath == toCompare.imagePath;
    };
}
