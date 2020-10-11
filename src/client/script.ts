import * as io from 'socket.io-client';

import { SERVER_URL } from '../common/consts';

const socket = io(SERVER_URL);

socket.on('message', (message: any) => {
  console.log(message);
})

function sendMsg(message = 'hello world') {
  socket.emit("message", message);
}
