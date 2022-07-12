const express = require("express");
const http = require("http");
const websocket = require("ws");

const indexRouter = require("./routes/index");

const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);

const server = http.createServer(app);

const wss = new websocket.Server({ server });
const websockets = {}; //property: websocket, value: game

function Game(id) {
    this.id = id;
    this.playerA = null;
    this.playerB = null;
    this.cardImagePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    this.addPlayer = function (p) {
        if (this.playerA == null) {
            this.playerA = p;
            return "A";
        } else if (this.playerB == null) {
            this.playerB = p;
            return "B";
        }
    }
    this.hasTwoConnectedPlayers = function () {
        return (this.playerA != null && this.playerB != null);
    }
    this.shuffle = function () {
        this.cardImagePosition.sort((a, b) => Math.random() - 0.5);
    }

    this.shuffle();
}

let gamesInitialized = 0;
let currentGame = new Game(gamesInitialized++); //Game object
let connectionID = 0; //each websocket receives a unique ID

wss.on("connection", function (ws) {
    /*
    * two-player game: every two players are added to the same game
    */
    const con = ws;
    con["id"] = connectionID++;
    const playerType = currentGame.addPlayer(con);
    websockets[con["id"]] = currentGame;

    console.log(
        `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
    );

    /*
    * inform the client about its assigned player type, player A starts the game
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
    * once we have two players, there is no way back;
    * a new game object is created;
    * if a player now leaves, the game is aborted (player is not preplaced)
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
        currentGame = new Game(gamesInitialized++);
    }

    /*
    * message coming in from a player:
    *  1. determine the game object
    *  2. determine the opposing player OP
    *  3. send the message to OP
    */
    con.on("message", message => {
        const dmsg = JSON.parse(message);

        const gameObj = websockets[con["id"]];
        const isPlayerA = gameObj.playerA == con;
        const op = isPlayerA ? gameObj.playerB : gameObj.playerA;

        if (dmsg.type == 'pickCard') {
            op.send(JSON.stringify({
                type: 'pickedCard',
                data: dmsg.data
            }));
        }
    });

    con.on("close", code => {
        console.log(`${con["id"]} disconnected ...`);

        const gameObj = websockets[con["id"]];

        if (code == 1001) {
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
    })
});

server.listen(port);