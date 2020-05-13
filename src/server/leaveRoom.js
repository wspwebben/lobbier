const EVENTS = require('../common/events.js');

function leaveRoom(io) {

  return function({ id, name }) {
    const socket = this;
    const rooms = io.sockets.adapter.rooms;

    if (!rooms[id]) {
      socket.emit(EVENTS.ERROR.NO_ROOM);
      return;
    }
    
    io.to(id).emit(EVENTS.ROOM.LEFT, {
      name,
    });
    socket.leave(id);
  }
}

module.exports = leaveRoom;
