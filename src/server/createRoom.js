const EVENTS = require('../common/events.js');
const getRoomId = require('./createRoomGenerator.js')();

function createRoom({ name }) {
  const socket = this;

  const { value: roomId } = getRoomId.next();

  socket.join(roomId);
  socket.emit(EVENTS.ROOM.CREATED, {
    roomId,
    socketId: socket.id
  })
}

module.exports = createRoom