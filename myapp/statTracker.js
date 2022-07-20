/**
 * In-game stat tracker. 
 * Substitute of a proper database.
 */
 const gameStatus = {
    usersOnline: 0, 
    gameStarted: 0,
    gamesCompleted: 0
  };
  
  module.exports = gameStatus;