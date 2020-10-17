import Vue from 'vue';
import App from './App.vue';
import { WebSocketGameLobbyClient } from 'websocket-game-lobby-client';

const gameLobby = new WebSocketGameLobbyClient({
    port: 3000
});

gameLobby.addEventListener('message', ({ data }) => {
    console.log(JSON.parse(data));
});

new Vue({
    render: createElement => createElement(App),
}).$mount('#app');
