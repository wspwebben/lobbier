const EVENTS = require('../common/events.js');

const Game = require('../games/no_tnanks/game');

const players = new Map()

function lobbier(io, socket) {
  const id = 'test'
  socket.join(id);
  socket.to(id).emit('join', socket.id);

  const room = io.sockets.adapter.rooms[id];

  const canStart = () => {
    return true;
    return (players.size >= 3);
  }

  players.set(socket.id, socket);

  if (canStart()) {
    io.emit('enough-players', true);
  }

  socket.on('game-start', () => {
    io.emit('game-start');
    console.log([...players.entries()])

    const game = new Game([...players.values()], [...players.keys()]);
  });

  socket.on('disconnect', () => {
    players.delete(socket.id);
    socket.leave(id);
    if (!canStart()) {
      io.emit('enough-players', false);
    }
  })
  // const players = mock.players(3);

  // socket.on(EVENTS.ROOM.CREATE, createRoom);
  // socket.on(EVENTS.ROOM.JOIN, joinRoom(io));
  // socket.on(EVENTS.ROOM.LEAVE, leaveRoom(io));
}

module.exports = lobbier;
