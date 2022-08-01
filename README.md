# Memory Game

## About The Project

![Alt text](/screenshot.png?raw=true "Screenshot of the game")

The Memory game web application was created mainly in educational purposes. It helped me to understand how to create an web application with its own server. It is a simple game which allows users to play with each other. The server can host (theoretically) infinitely amount of games and stores basic statistics about them. HTTP server and using websockets as well.

**Built With**

- HTML

- JavaScript

- Express.js

- CSS

- EJS

## Getting Started

To get a local copy and run, follow these simple steps.

**Prerequisities**

- Node.js

- npm

**Installation**

1. Clone the repo 

`git clone https://github.com/kmariuszk/memoryGame.git`

2. Install the packages

`npm install`

3. Run the server

`npm start`

4. Play the game on

> localhost:3000

Disclaimer: mentioned instructions allow you to run a server working only in your local network. If you want to play with somebody in a different network you can use ngrok.com. Follow their instruction to set it up and edit the first line of /myapp/public/javascripts/interactions.js file as described in it. Then, run a ngrok server

`ngrok tcp 3000`

and follow the instructions above.