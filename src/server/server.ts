import { createServer } from 'http';
import * as express from 'express';
import * as socketio from 'socket.io';
import * as path from 'path';

import { EVENTS } from '../common/consts';
import { Socket } from 'socket.io';

import { createRoom, joinRoom, hasRoom, normalizeRoomId } from './rooms';

const app = express();
const port = process.env.port || 3000;

const server = createServer(app);

app.use(express.static(path.resolve('./dist')));
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

const io = socketio(server);

io.on('connection', (socket: Socket) => {
  console.log('connected');

  socket.on(EVENTS.CREATE_ROOM, (message: any) => {
    const host = {
      name: 'chelik',
    };

    const room = createRoom(host);
    socket.emit(`Created room with id: ${room.id}`);
  });

  socket.on(EVENTS.JOIN_ROOM, (message: any) => {
    const roomId = normalizeRoomId(message.id);

    if (hasRoom(roomId)) {
      const player = {
        name: 'noviy-chelik',
      };

      joinRoom(roomId, player);
      socket.join(roomId);
      io.to(roomId).emit('message', `User joined room ${roomId}`);
    } else {
      console.log(`room ${roomId} not found`);
    }
  });

  socket.on('message', (message: any) => {
    const roomId = normalizeRoomId(message.id);

    io.to(roomId).emit('message', `check`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
