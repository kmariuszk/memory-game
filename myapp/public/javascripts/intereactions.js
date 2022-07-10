const gameTime = document.getElementById('time');
const cards = [];
const cardsImagesPaths = ["images/card0.jpg", "images/card1.jpg", "images/card2.jpg", "images/card3.jpg", "images/card4.jpg", "images/card5.jpg", "images/card6.jpg", "images/card7.jpg"];
let revealed = [];
let players = [];
let turn = 0;
let gameStart = false;
const socket = new WebSocket("ws://localhost:3000");

// Since now the player on the position 0 is 'you' and on the position 1 is 'opponent'. Player A can pick a card only if the turn is even
socket.addEventListener("message", e => {
    let message = JSON.parse(e.data);

    if (message.type == 'playerAssign') {
        if (message.data == 'A') {
            players = [new Player('A'), new Player('B')];
            players[0].setElement('player0');
            players[1].setElement('player1');
        } else {
            players = [new Player('B'), new Player('A')];
            players[0].setElement('player0');
            players[1].setElement('player1');
        }
    }
    else if (message.type == "imagesArray") {
        gameStart = true;
        startTimer();
        attachImages(message.data);
    }
    else if (message.type = "pickedCard") {
        revealCard(message.data);
    }
    else if (message.type = "gameOver") {
        finishTheGame();
    }
});

// Attaching each image to the correct card
function attachImages(imagesArray) {
    for (let i = 0; i < 16; i++) {
        cards.push(new Card(i, imagesArray[i] % 8));
    }
}


function pickCard(cardNumber) {
    if (!gameStart) {
        window.alert("The game hasn't started yet!");
        return;
    } else if (!cards[cardNumber].availability()) {
        window.alert("This card is not available anymore!");
        return;
    } else if (revealed.length == 2) {
        window.alert("You can pick only two cards!");
        return;
    } else if ((turn % 2 == 0 && players[0].id == 'B') || (turn % 2 == 1 && players[0].id == 'A')) {
        window.alert("It's yours opponent turn!");
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
    cards[cardNumber].reveal();
    revealed.push(cards[cardNumber]);

    if (revealed.length == 2) {
        if (revealed[0].equals(revealed[1])) {
            revealed.forEach(card => {
                card.hide();
            });

            if (players[0].getId() == 'A') {
                if (turn % 2 == 0) players[0].increasePoints();
                else players[1].increasePoints();
            } else {
                if (turn % 2 == 0) players[1].increasePoints();
                else players[0].increasePoints();
            }

            revealed = [];
            turn++;
        } else {
            setTimeout(() => {
                revealed.forEach(card => {
                card.secrete();
            });
                revealed = [];
                turn++;
            }, 2000);
        }
    }
    isOver();
}

function isOver() {
    if (players[0].getPoints() + players[1].getPoints() == 8) {
        finishTheGame();
    }
}

function startTimer() {
    let start = Date.now();

    setInterval(() => {
        let delta = Math.floor((Date.now() - start) / 1000);
        let minutes = Math.floor(delta / 60);
        let seconds = delta % 60;

        gameTime.textContent = 'GAME TIME: ' + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
    }, 1000);
}

socket.onclose = function () {
    if(!alert("Unfortunatelly, your opponent has aborted the game.")) window.location = "http://localhost:3000/";
};

function finishTheGame() {

    let txt = "";

    if (players[1].getPoints() > players[0].getPoints()) {
        txt = "The game is over! Unfortunately, you lost.";
    } else if (players[1].getPoints() == players[0].getPoints()) {
        txt = "It was a good game! But there's no winner, the game is drawn.";
    } else {
        txt = "Congratulations! You won the game!";
    }
    
    txt += " Would you like to play one more game?";

    if (confirm(txt)) {
        window.location.reload();
    } else {
        window.location = "http://localhost:3000/";
    }
}