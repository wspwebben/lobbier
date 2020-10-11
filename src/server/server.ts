import { createServer } from 'http';
import * as express from 'express';
import * as socketio from "socket.io";
import * as path from 'path';

import { EVENTS } from '../common/consts';

const app = express();
const port = process.env.port || 3000;

const server = createServer(app);

app.use(express.static(path.resolve('./dist')))
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

const socket = socketio(server);

socket.on('connection', (client: any) => {
  console.log('connected');

  client.on(EVENTS.CREATE_ROOM, (message: any) => {
    console.log('Created', message);
  })

  client.on(EVENTS.JOIN_ROOM, (room: any) => {
    console.log('Joined', room);
  })
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
