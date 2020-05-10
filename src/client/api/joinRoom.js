import socket from './socket';

import EVENTS from '../../common/events';

import { API_WAITING_TIME } from '../consts';

function joinRoom(name, roomId) {

  return new Promise((resolve, reject) => {
    let cancelTimeout = null;

    const onJoined = ({ name }) => {
      if (cancelTimeout) {
        clearTimeout(cancelTimeout)
        cancelTimeout = null
      }

      resolve(name)
    }

    const onNoRoom = () => {
      reject();
    }

    const cancelCreation = () => {
      socket.off(EVENTS.ROOM.JOINED, onJoined);
      socket.off(EVENTS.ERROR.NO_ROOM, onNoRoom)
      reject();
    }

    socket.once(EVENTS.ROOM.JOINED, onJoined)
    socket.once(EVENTS.ERROR.NO_ROOM, onNoRoom);
    socket.emit(EVENTS.ROOM.JOIN, {
      name,
      id: roomId,
    });

    cancelTimeout = setTimeout(cancelCreation, API_WAITING_TIME);
  });
}

export default joinRoom;
