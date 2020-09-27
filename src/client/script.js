const socket = io("http://localhost:3000");

function sendMsg(message = 'hello world') {
  socket.emit("message", message);
}

socket.on('message', (message) => {
  console.log(message);
})