const gameTime = document.getElementById('gameTime');
const cards = [];
const cardsImagesPaths = ["images/card0.jpg", "images/card1.jpg", "images/card2.jpg", "images/card3.jpg", "images/card4.jpg", "images/card5.jpg", "images/card6.jpg", "images/card7.jpg"];
const cardImagePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let revealed = [];
let turn = 0;
const players = [new Player(0), new Player(1)];

initialize();

// Store all the DOM objects in the array as Card objects;
function initialize() {
    cardImagePosition.sort((a, b) => Math.random() - 0.5);
    for (let i = 0; i < 16; i++) {
        cards.push(new Card(i, cardImagePosition[i] % 8));
    }
}

function revealAll() {
    cards.forEach((card) => {
        card.reveal();
    })
}

function Card(id, imageId) {
    this.id = id;
    this.imageId = imageId;
    this.element = document.getElementById('card' + id);
    this.available = true;

    this.setImage = function (path) {
        this.element.src = path;
    }
    this.reveal = function () {
        this.element.src = cardsImagesPaths[imageId];
    }
    this.secrete = function () {
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
}

function Player(id) {
    this.id = id;
    this.points = 0;
    this.element = document.getElementById('player' + id);
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
}


function pickCard(cardNumber) {
    if (!cards[cardNumber].availability()) {
        window.alert("this card is chosen!");
        return;
    }
    if (revealed.length == 2) {
        if (cards[revealed[0]].getImageId() == cards[revealed[1]].getImageId()) {
            cards[revealed[0]].hide();
            cards[revealed[1]].hide();
            players[turn % 2].increasePoints();
        } else {
            cards[revealed[0]].secrete();
            cards[revealed[1]].secrete();
        }
        revealed = [];
        turn++;
    }

    cards[cardNumber].reveal();
    revealed.push(cardNumber);
}

let start = Date.now();

setInterval(() => {
    let delta = Math.floor((Date.now() - start) / 1000);
    let minutes = Math.floor(delta / 60);
    let seconds = delta % 60;
    if (gameTime != null) {
        gameTime.textContent = 'GAME TIME: ' + minutes + ":" + seconds;
    }
}, 1000);


