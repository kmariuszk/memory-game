const express = require("express");
const http = require("http");
const websocket = require("ws");

const indexRouter = require("./routes/index");
const Game = require("./game");
const GameStatus = require("./statTracker")
const { Console } = require("console");
const gameStatus = require("./statTracker");

const port = process.argv[2];
const app = express();

app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);

const server = http.createServer(app);

const wss = new websocket.Server({ server });
const websockets = {}; 

let currentGame = new Game(GameStatus.gameStarted); //Game object
let connectionID = 0; //each websocket receives a unique ID

/*
 * Regularly clean up the websockets object.
 */
setInterval(function () {
    for (let i in websockets) {
        if (Object.prototype.hasOwnProperty.call(websockets, i)) {
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if (gameObj.gameState == "FINISHED" || gameObj.gameState == "ABORTED") {
                delete websockets[i];
            }
        }
    }
}, 50000);

wss.on("connection", function (ws) {

    /*
    * Two-player game: every two players are added to the same game.
    */
    const con = ws;
    con["id"] = connectionID++;
    const playerType = currentGame.addPlayer(con);
    websockets[con["id"]] = currentGame;
    gameStatus.usersOnline++;

    console.log(
        `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
    );

    /*
    * Inform the client about its assigned player type, player A starts the game.
    */
    if (playerType == "A") {
        con.send(JSON.stringify({
            type: 'playerAssign',
            data: 'A'
        }));
    } else {
        con.send(JSON.stringify({
            type: 'playerAssign',
            data: 'B'
        }));
    }

    /*
    * Once we have two players, there is no way back; a new game object is created.
    * If a player now leaves, the game is aborted (player is not preplaced).
    */
    if (currentGame.hasTwoConnectedPlayers()) {

        const gameObj = websockets[con["id"]];

        // Send the array with encoded cards positions to a player A
        gameObj.playerA.send(JSON.stringify({
            type: 'imagesArray',
            data: currentGame.cardImagePosition
        }));

        // Send the array with encoded cards positions to a player B
        con.send(JSON.stringify({
            type: 'imagesArray',
            data: currentGame.cardImagePosition
        }));

        console.log("The game " + currentGame.id + " has started!");

        currentGame = new Game(gameStatus.gameStarted++);
    }

    /*
    * Message coming in from a player:
    *  1. determine the game object
    *  2. determine the opposing player
    *  3. send the message to opponent
    */
    con.on("message", e => {
        const message = JSON.parse(e);

        const gameObj = websockets[con["id"]];
        const isPlayerA = gameObj.playerA == con;
        const opponent = isPlayerA ? gameObj.playerB : gameObj.playerA;

        // Player picked a card in his/her turn
        if (message.type == 'pickCard') {
            opponent.send(JSON.stringify({
                type: 'pickedCard',
                data: message.data
            }));
        }

        // Player inform the server the game is finished
        if (message.type == 'gameOver') {
            gameStatus.gamesCompleted++;
            gameObj.setStatus("FINISHED");
            
            gameObj.playerA.send(JSON.stringify({
                type: 'gameFinished'
            }));

            gameObj.playerB.send(JSON.stringify({
                type: 'gameFinished'
            }));
        }
    });

    con.on("close", code => {

        gameStatus.usersOnline--;
        console.log('Player ' + con["id"] + ' disconnected ...');

        if (code == 1001) {
            /*
             * if possible, abort the game; if not, the game is already completed
             */
            const gameObj = websockets[con["id"]];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED");

                /*
                 * Determine whose connection remains open and close it.
                 */
                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                } catch (e) {
                    console.log("Player A closing: " + e);
                }

                try {
                    gameObj.playerB.close();
                    gameObj.playerB = null;
                } catch (e) {
                    console.log("Player B closing: " + e);
                }
            }
            
            if (gameObj.isValidTransition(gameObj.gameState, "0 JOINT")) {
                gameObj.setStatus("0 JOINT");
            }
        }
    });
});

server.listen(port);
