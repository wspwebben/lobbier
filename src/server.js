const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io')

const app = express();

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
})

const PORT = 3000

const httpServer = http.createServer(app)
httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

const io = socketio(httpServer);

const lobbier = require('./lobby/lobbier.js')

io.sockets.on('connection', socket => {
  lobbier(io, socket);
})
