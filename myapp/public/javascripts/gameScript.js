const gameTime = document.getElementById('gameTime');
const cards = [];
const cardsImagesPaths = ["images/card0.jpg", "images/card1.jpg", "images/card2.jpg", "images/card3.jpg", "images/card4.jpg", "images/card5.jpg", "images/card6.jpg", "images/card7.jpg"];
let revealed = [];
let players = [];
let turn = 0;
const socket = new WebSocket("ws://localhost:3000");

// Initialize all necessery things when client connects to the server
socket.addEventListener("open", () => {
    console.log("Connected to the server!");
    // setUp();
});

// Since now the player on the position 0 is 'you' and on the position 1 is 'opponent'
socket.addEventListener("message", e => {
    let message = JSON.parse(e.data);

    if (message.type == 'playerAssign') {
        if (message.data == 'A') players = [new Player('A'), new Player('B')];
        else if (message.data == 'B') players = [new Player('B'), new Player('A')];
    } else if (message.type == "imagesArray") {
        attachImages(message.data);
    } else if (message.type = "pickedCard") {
        revealCard(message.data);
    }
});

// Attaching each image to the correct card
function attachImages(imagesArray) {
    for (let i = 0; i < 16; i++) {
        cards.push(new Card(i, imagesArray[i] % 8));
    }
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
    this.equals = function (toCompare) {
        return this.imageId == toCompare.getImageId();
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
    } else {
        socket.send(JSON.stringify({
            type: 'pickCard',
            data: cardNumber
        }));
        revealCard(cardNumber);
    }
}

function revealCard(cardNumber) {
    if (revealed.length == 2) {
        // When player pick a pair of cards:
        if (cards[revealed[0]].equals(cards[revealed[1]])) {
            cards[revealed[0]].hide();
            cards[revealed[1]].hide();
            players[(turn + 1) % 2].increasePoints();
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

// Debug functions only, will be deleted eventually
function revealAll() {
    cards.forEach((card) => {
        card.reveal();
    })
}