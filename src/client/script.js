import { WebSocketGameLobbyClient } from 'websocket-game-lobby-client';

const gameLobby = new WebSocketGameLobbyClient({
    port: 3000
});

gameLobby.addEventListener('message', ({ data }) => {
    console.log(JSON.parse(data));
});

const buttonCreateGame = document.querySelector('button');
buttonCreateGame.addEventListener('click', () => gameLobby.send('create'));