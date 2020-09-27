import { createServer } from 'http';
import * as express from 'express';
import * as socketio from "socket.io";
import * as path from 'path';

const app = express();
const port = process.env.port || 3000;

const server = createServer(app);

app.use(express.static(path.resolve('./src/client')))
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve('./src/client/index.html'));
});

const io = socketio(server);

io.on('connection', (socket: any) => {
  console.log('connected');

  socket.on('message', (message: any) => {
    console.log(message);
    socket.emit('message', `response to ${message}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
