import socket from './socket';

import EVENTS from '../../common/events';

import { API_WAITING_TIME } from '../consts';

function createRoom(name) {
  console.log(`${name} is trying to create a room`);

  return new Promise((resolve, reject) => {
    let cancelTimeout = null

    const onCreated = ({ roomId, socketId }) => {
      console.log(`Room id is ${roomId}, socket: ${socketId}`);
  
      if (cancelTimeout) {
        clearTimeout(cancelTimeout)
        cancelTimeout = null
      }

      resolve(roomId);
    }

    const cancelCreation = () => {
      console.log('Room hasnt been created');

      socket.off(onCreated);
      reject();
    }

    socket.once(EVENTS.ROOM.CREATED, onCreated)
    socket.emit(EVENTS.ROOM.CREATE, {
      name,
    });

    cancelTimeout = setTimeout(cancelCreation, API_WAITING_TIME);
  });
  
}

export default createRoom;
