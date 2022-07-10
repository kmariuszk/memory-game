function Card(id, imageId) {
    this.id = id;
    this.imageId = imageId;
    this.element = document.getElementById('card' + id);
    this.available = true;

    this.setImage = function (path) {
        this.element.src = path;
    }
    this.reveal = function () {
        this.available = false;
        this.element.src = cardsImagesPaths[imageId];
    }
    this.secrete = function () {
        this.available = true;
        this.element.src = "images/card_deck.jpg";
    }   
    this.hide = function () {
        this.available = false;
    }
    this.getImageId = function () {
        return this.imageId;
    }
    this.availability = function () {
        return this.available;
    }
    this.equals = function (toCompare) {
        return this.imageId == toCompare.getImageId();
    }

    this.secrete();
}