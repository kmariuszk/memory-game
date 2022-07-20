var express = require('express');
var router = express.Router();

const gameStatus = require("../statTracker");

/* GET splash page */ 
router.get("/", function(req, res) {
  res.render("splash.ejs", {
    usersOnline: gameStatus.usersOnline, 
    gameStarted: gameStatus.gameStarted,
    gamesCompleted: gameStatus.gamesCompleted
  });
});

/* Pressing the 'PLAY' button, returns game page */
router.get("/play", function(req, res) {
  res.sendFile("game.html", { root: "./public" });
});

module.exports = router;