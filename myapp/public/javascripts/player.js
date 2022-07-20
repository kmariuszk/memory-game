/**
 * Player class contains information about the user playing the game.
 */
class Player {

    /**
     * Construct a player object.
     * 
     * @param  {String} id - id of a player (unique in a single game).
     * @param  {String} htmlElement - id of the DOM element of a player.
     */
    constructor(id, htmlElement) {
        this.id = id;
        this.points = 0;
        this.element = document.getElementById(htmlElement);
    }

    /**
     * Returns points.
     */
    getPoints() {
        return this.points;
    };

    /**
     * Increases points by 1 and displays it.
     */
    increasePoints() {
        this.points++;
        this.refreshScore();
    };

    /**
     * Displays updated points value.
     */
    refreshScore() {
        this.element.textContent = this.points;
    };

    /**
     * Returns id.
     */
    getId() {
        return this.id;
    };
}