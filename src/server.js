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
  console.log(`Open in browser: http://localhost:${PORT}`);
})

const io = socketio(httpServer);

const lobbier = require('./server/lobbier.js')

io.sockets.on('connection', socket => {
  lobbier(io, socket);
})
