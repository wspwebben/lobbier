import * as io from 'socket.io-client';

import { SERVER_URL, EVENTS } from '../common/consts';

const socket = io(SERVER_URL);

socket.on('message', (message: any) => {
  console.log(message);
})

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
const messageButton = form.querySelector('.message');

form.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const roomId = Number(roomIdInput.value);

  if (roomId) {
    joinRoom(roomId);
  } else {
    createRoom();
  }
})

messageButton.addEventListener('click', () => {
  const id = Number(roomIdInput.value);

  if (id) {
    socket.emit('message', {
      id
    })
  }
})