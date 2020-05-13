import socket from './socket';

import EVENTS from '../../common/events';

function leaveRoom(name, roomId) {
  return new Promise((resolve, reject) => {

    const onLeft = () => {
      console.log('Left the room');
      resolve();
    }

    socket.once(EVENTS.ROOM.LEFT, onLeft)
    socket.emit(EVENTS.ROOM.LEAVE, {
      name,
      id: roomId,
    });
  })
};

export default leaveRoom;
