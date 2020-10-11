import * as io from 'socket.io-client';

import { SERVER_URL, EVENTS } from '../common/consts';

const socket = io(SERVER_URL);

function createRoom() {
  socket.emit(EVENTS.CREATE_ROOM, {

  });
}

function joinRoom(id: number = 1) {
  socket.emit(EVENTS.JOIN_ROOM, {
    id
  })
}

const form = document.querySelector('form');
const roomIdInput = <HTMLInputElement>form.querySelector('.input');

form.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const roomId = Number(roomIdInput.value);

  if (roomId) {
    joinRoom(roomId);
  } else {
    createRoom();
  }
})
