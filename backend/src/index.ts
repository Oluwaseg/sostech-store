import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './configs/passport';
import logger from './libs/logger';
import apiResponse from './middlewares/response';
import routes from './routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

app.use(apiResponse);

// Initialize passport
app.use(passport.initialize());

app.get('/', (_req: Request, res: Response) => res.send('Server is up'));

app.use('/api', routes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack || err.message || String(err));
  res.status(500).json({ error: 'internal server error' });
});

export default app;
