import express, { Application, Request, Response } from 'express';
import cors from 'cors';

export const app: Application = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

console.log(process.cwd());
