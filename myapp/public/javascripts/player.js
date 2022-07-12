//Player object: stores all necessary informations about the player object
class Player {
    constructor(id, tagElement) {
        this.id = id;
        this.points = 0;
        this.element = document.getElementById(tagElement);
    }

    getPoints() {
        return this.points;
    };

    increasePoints() {
        this.points++;
        this.refreshScore();
    };

    refreshScore() {
        this.element.textContent = this.points;
    };

    getId() {
        return this.id;
    };
}