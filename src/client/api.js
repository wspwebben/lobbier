import { WebSocketGameLobbyClient } from 'websocket-game-lobby-client';

const EVENTS = {
  CREATE: 'create',
  JOIN: 'join',
  LEAVE: 'leave',
  START: 'start',
  END: 'end',
};

const gameLobby = new WebSocketGameLobbyClient({
  port: 3000,
});

const parseAndPass = next => ({ data }) => next(JSON.parse(data));

gameLobby.addEventListener('message', parseAndPass((message) => {
  console.log(message)
}));

export const create = () => {
  gameLobby.send(EVENTS.CREATE);
};

export const join = gameCode => {
  gameLobby.send(EVENTS.JOIN, { gameCode });
};

export const leave = () => {
  gameLobby.send(EVENTS.LEAVE);
};

export const start = () => {
  gameLobby.send(EVENTS.START);
};

export const end = () => {
  gameLobby.send(EVENTS.END);
};
