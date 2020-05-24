const EVENTS = require('../common/events.js');

const Game = require('../games/no_thanks');

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
    
    const playersData = [...players.keys()].map(name => ({ name }));

    const game = new Game([...players.values()], playersData);
  });

  socket.on('disconnect', () => {
    players.delete(socket.id);
    socket.leave(id);
    if (!canStart()) {
      io.emit('enough-players', false);
    }
  })
}

module.exports = lobbier;
