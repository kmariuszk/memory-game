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

function Game(id) {
    this.id = id;
    this.playerA = null;
    this.playerB = null;
    this.addPlayer = function (p) {
        if (this.playerA == null) {
            this.playerA = p;
            return "A";
        } else if(this.playerB == null){
            this.playerB = p;
            return "B";
        }
    }
    this.hasTwoConnectedPlayers = function () {
        return (this.playerA != null && this.playerB != null);
    }
}

let gamesInitialized = 0;
const websockets = {}; //property: websocket, value: game
let currentGame = new Game(gamesInitialized++); //Game object
let connectionID = 0; //each websocket receives a unique ID

wss.on("connection", function (ws) {
    // Here I need to put all the websockets functionality, namely adding players to the game, receiving messages from the players and sending them
    
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
    * inform the client about its assigned player type
    */
    con.send(playerType == "A" ? "You are player A" : "You are player B");

    /*
    * once we have two players, there is no way back;
    * a new game object is created;
    * if a player now leaves, the game is aborted (player is not preplaced)
    */
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gamesInitialized++);
    }

    /*
    * message coming in from a player:
    *  1. determine the game object
    *  2. determine the opposing player OP
    *  3. send the message to OP
    */
    con.on("message", function incoming(message) {
        // const oMsg = JSON.parse(message.toString());

        // const gameObj = websockets[con["id"]];
        // const isPlayerA = gameObj.playerA == con ? true : false;

        // if (isPlayerA) {
        //     /*
        //      * player A cannot do a lot, just send the target word;
        //      * if player B is already available, send message to B
        //      */
        //     if (oMsg.type == messages.T_TARGET_WORD) {
        //         gameObj.setWord(oMsg.data);

        //         if (gameObj.hasTwoConnectedPlayers()) {
        //             gameObj.playerB.send(message);
        //         }
        //     }
        // } else {
        //     /*
        //      * player B can make a guess;
        //      * this guess is forwarded to A
        //      */
        //     if (oMsg.type == messages.T_MAKE_A_GUESS) {
        //         gameObj.playerA.send(message);
        //         gameObj.setStatus("CHAR GUESSED");
        //     }

        //     /*
        //      * player B can state who won/lost
        //      */
        //     if (oMsg.type == messages.T_GAME_WON_BY) {
        //         gameObj.setStatus(oMsg.data);
        //         //game was won by somebody, update statistics
        //         gameStatus.gamesCompleted++;
        //     }
        // }
    });
});

server.listen(port);