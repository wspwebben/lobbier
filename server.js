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
    async (ctx, datastore) => {
        console.log(ctx)
        
    }
);

gameLobby.addEventListener(
    'join',
    async (ctx, datastore) => {
        console.log(ctx);
    }
);