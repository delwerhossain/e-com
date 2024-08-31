import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { categoryRoutes } from './app/modules/Categories/categories.routes';
import router from './routes';

export const app: Application = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1', router);






app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

console.log(process.cwd());
