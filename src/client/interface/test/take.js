import socket from '../../api/socket';

function take() {
  socket.emit('game', {
    // id: 
    move: 'take',
  });
}

export default take;
