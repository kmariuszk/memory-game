# Memory Game

## About The Project

![Alt text](/screenshotSplash.png?raw=true "Screenshot of the splash screen")
![Alt text](/screenshot.png?raw=true "Screenshot of the game screen")

The Memory Game web application was created mainly for educational purposes. It helped me to understand how to create a web application with its own server. It is a simple application which allows users to play with each other. The server can host (theoretically) an infinitely amount of games and stores basic statistics about them. The server is an HTTP server which uses WebSockets for real-time communication between the players.

**Built With**

- HTML

- JavaScript

- Express.js

- CSS

- EJS

## Getting Started

To get a local copy and run, follow these simple steps.

**Prerequisities**

- Git

- Node.js

- npm

**Installation**

1. Clone the repo 

`git clone https://github.com/kmariuszk/memoryGame.git`

2. Install the packages

`npm install`

3. Run the server

`npm start`

4. Access the website by typing 'localhost:3000' to the address bar of the browser

*Disclaimer:* mentioned instructions allow the user to run a server working only in the user's local network. If a user wants to play with somebody using a different network then I suggest using ngrok.com. Follow their instruction to set it up and edit the first line of /myapp/public/javascripts/interactions.js file as described in it. Then, run a ngrok server

`ngrok tcp 3000`

and follow the instructions above.