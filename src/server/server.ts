import { createServer } from 'http';
import * as express from 'express';
import * as path from 'path';

const app = express();
const port = process.env.port || 3000;

const server = createServer(app);

app.use(express.static(path.resolve('./src/client')))
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve('./src/client/index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
