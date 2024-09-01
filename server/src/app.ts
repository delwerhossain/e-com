import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import notFound from './middlewares/notFound';

export const app: Application = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('SERVER RUNNING!');
});

//Not Found
app.use(notFound);
