import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { categoryRoutes } from './app/modules/Categories/categories.routes';

export const app: Application = express();
app.use(express.json());
app.use(cors());

//routes.....
app.use('/api/categories', categoryRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

console.log(process.cwd());
