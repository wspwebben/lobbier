import socket from '../../api/socket';

function take() {
  socket.emit('game', {
    id: socket.id,
    move: 'take',
  });
}

export default take;
