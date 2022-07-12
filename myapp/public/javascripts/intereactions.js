const gameTime = document.getElementById('time');
// const cards = [];
// const cardsImagesPaths = ["images/card0.jpg", "images/card1.jpg", "images/card2.jpg", "images/card3.jpg", "images/card4.jpg", "images/card5.jpg", "images/card6.jpg", "images/card7.jpg"];
// let revealed = [];
// let players = [];
// let turn = 0;
// let gameStart = false;

const socket = new WebSocket("ws://localhost:3000");
let game;

socket.addEventListener("message", e => {
    let message = JSON.parse(e.data);
    console.log("Received a message! + " + message.type);

    if (message.type == 'playerAssign') {
        game = new Game();
        game.assignPlayer(message.data);
    }

    // Receive an array with encoded positions of the cards (images)
    else if (message.type == "imagesArray") {
        startTimer();
        game.initialize(message.data);
    }
    else if (message.type = "pickedCard") {
        revealCard(message.data);
    }
    else if (message.type = "gameOver") {
        finishTheGame();
    }
});

// // Attaching each image to the correct card
// function attachImages(imagesArray) {
//     for (let i = 0; i < 16; i++) {
//         cards.push(new Card(i, cardsImagesPaths[imagesArray[i] % 8]));
//     }
//     console.log('Images attached!');
// }


function pickCard(cardNumber) {
    if (!game.gameStarted) {
        window.alert("The game hasn't started yet!");
        return;
    } else if (!game.cardAvailable(cardNumber)) {
        window.alert("This card is not available anymore!");
        return;
    } else if (game.canPickMoreCards()) {
        window.alert("You can pick only two cards!");
        return;
    } else if (!game.isItMineTurn()) {
        window.alert("It's yours opponent turn!");
        return;
    } else {
        // Player sends information about the chosen card to the server
        socket.send(JSON.stringify({
            type: 'pickCard',
            data: cardNumber
        }));
        revealCard(cardNumber);
    }
}

// function isOver() {
//     if (players[0].getPoints() + players[1].getPoints() == 8) {
//         finishTheGame();
//     }
// }

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
    if (!alert("Unfortunatelly, your opponent has aborted the game.")) window.location = "http://localhost:3000/";
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