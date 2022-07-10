//Player object: stores all necessary informations about the player object
function Player(id) {
    this.id = id;
    this.points = 0;
    this.element;
    this.getPoints = function () {
        return this.points;
    }
    this.increasePoints = function () {
        this.points++;
        this.refreshScore();
    }
    this.refreshScore = function () {
        this.element.textContent = this.points;
    }
    this.setElement = function (id) {
        this.element = document.getElementById(id);
    }
    this.getId = function () {
        return this.id;
    }
}