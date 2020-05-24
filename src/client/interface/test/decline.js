import socket from '../../api/socket';

function decline() {
  socket.emit('game', {
    // id: 
    move: 'decline',
  });
}

export default decline;
