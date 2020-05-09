const EVENTS = require('../common/events.js');

function joinRoom(io) {

  return function({ name, id }) {
    const socket = this;

    const rooms = io.sockets.adapter.rooms;

    if (!rooms[id]) {
      socket.emit(EVENTS.ERROR.NO_ROOM);
      return;
    }
    
    socket.join(id);
    io.to(id).emit(EVENTS.ROOM.JOINED, name)
  }
}

module.exports = joinRoom;
