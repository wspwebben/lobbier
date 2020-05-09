const EVENTS = require('../common/events.js');
const createRoom = require('./createRoom.js');
const joinRoom = require('./joinRoom.js');

function lobbier(io, socket) {
  socket.on(EVENTS.ROOM.CREATE, createRoom);
  socket.on(EVENTS.ROOM.JOIN, joinRoom(io));
}

module.exports = lobbier;
