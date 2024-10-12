import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorhandler';

export const app: Application = express();
//parsers
app.use(express.json());

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('SERVER RUNNING!');
});

//global Error handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);
