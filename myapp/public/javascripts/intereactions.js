const webSocketUrl = "2.tcp.eu.ngrok.io:18146"; // Originally, it was: localhost:3000
const socket = new WebSocket("ws://" + webSocketUrl);

var game;
var intervalId;

/**
 * Reacts to the received server message.
 */
socket.addEventListener("message", e => {
    let message = JSON.parse(e.data);

    // Assign type of player.
    if (message.type == 'playerAssign') {
        this.game = new Game();
        this.game.assignPlayer(message.data);
    }

    // Receive an array with encoded positions of the cards images.
    if (message.type == "imagesArray") {
        startTimer();
        this.game.initialize(message.data);
    }

    // Reveal card which was chosen by the other player.
    if (message.type == "pickedCard") {
        this.game.revealCard(message.data);
        if (this.game.isFinished()) {
            gameOverMessage();
        }
    }

    // Finish the game.
    if (message.type == "gameFinished") {
        finishTheGame();
    }
});

/**
 * Player picks the card.
 * 
 * @param  {Integer} cardNumber - position of the picked card.
 */
function pickCard(cardNumber) {

    // Game has not started yet.
    if (!this.game.isGameStarted()) {
        window.alert("The game hasn't started yet!");
        return;
    }

    // Card is not available to pick.
    else if (!this.game.cardAvailable(cardNumber)) {
        window.alert("This card is not available anymore!");
        return;
    }

    // Player cannot pick anymore cards.
    else if (!this.game.canPickMoreCards()) {
        window.alert("You can pick only two cards!");
        return;
    }

    // Opponents turn. 
    else if (!this.game.isItMineTurn()) {
        window.alert("It's your opponents turn!");
        return;
    }

    // Player pick card and server is informed about it.
    else {
        socket.send(JSON.stringify({
            type: 'pickCard',
            data: cardNumber
        }));
        this.game.revealCard(cardNumber);
    }
}

/**
 * When connection with the server is closed.
 */
socket.onclose = function () {
    if (isAborted()) {
        stopTimer();
        if (!window.alert("Unfortunately you're opponent has left the game.")) {
            window.location = "http://localhost:3000/";
        }
    }
}
/**
 * Start the timer of the game.
 */
function startTimer() {
    const gameTime = document.getElementById('time');

    let start = Date.now();

    intervalId = setInterval(() => {
        let delta = Math.floor((Date.now() - start) / 1000);
        let minutes = Math.floor(delta / 60);
        let seconds = delta % 60;

        gameTime.textContent = 'GAME TIME: ' + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
    }, 1000);
}
/**
 * Stops the timer of the game.
 */
function stopTimer() {
    clearInterval(intervalId);
}

/**
 * Send a gameOver message to the server when the game is over.
 */
function gameOverMessage() {
    socket.send(JSON.stringify({
        type: 'gameOver',
    }));
}

/**
 * Returns whether the game is finished.
 */
function isAborted() {
    return !this.game.isFinished();
}

/**
 * Displays the final message to a player and ask what they want to do.
 */
function finishTheGame() {
    let finalMessage = this.game.finalMessage();
    stopTimer();

    setTimeout(() => {
        finalMessage += " Would you like to play one more game?";

        if (confirm(finalMessage)) {
            window.location.reload();
        } else {
            window.location = "http://localhost:3000/";
        }
    }, 500);
}