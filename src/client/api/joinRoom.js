import socket from './socket';

import EVENTS from '../../common/events';

import { API_WAITING_TIME } from '../consts';

function joinRoom(name, roomId) {

  return new Promise((resolve, reject) => {
    let cancelTimeout = null;

    const onJoined = (data) => {
      // console.log(`Room id is ${roomId}, socket: ${socketId}`);
      console.log(data);

      if (cancelTimeout) {
        clearTimeout(cancelTimeout)
        cancelTimeout = null
      }

      // resolve(roomId);
    }

    const cancelCreation = () => {
      socket.off(onJoined);
      reject();
    }

    socket.once(EVENTS.ROOM.JOINED, onJoined)
    socket.emit(EVENTS.ROOM.JOIN, {
      name,
      id: roomId,
    });

    cancelTimeout = setTimeout(cancelCreation, API_WAITING_TIME);
  });
}

export default joinRoom;
