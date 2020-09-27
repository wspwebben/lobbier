import { createServer } from 'http';
import * as express from 'express';

const app = express();
const port = process.env.port || 3000;

const server = createServer(app);

app.get("/", (req: any, res: any) => {
  res.send("hello world");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
