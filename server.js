const path = require('path');
const express = require('express');
const http = require('http');
const app = express();

const { WebSocketGameLobbyServer } = require('websocket-game-lobby');

const SERVER_PORT = 3000;

const distFolder = 'dist'

app.use(express.static(path.resolve(distFolder)))
app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${distFolder}/index.html`));
});

const server = http.createServer(app);

server.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});

const gameLobby = new WebSocketGameLobbyServer({
    server,
});

gameLobby.addEventListener(
    'create',
    async ({ gameId, playerId }, datastore) => {
        await datastore.editGame(gameId, async game => {
            game.custom.color = 'purple';
            return game;
        });
    }
);