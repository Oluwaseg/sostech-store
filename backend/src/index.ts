import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './configs/passport';
import logger from './libs/logger';
import { errorHandler } from './middlewares/error-handler';
import apiResponse from './middlewares/response';
import routes from './routes';

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : [frontendUrl];

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(
  morgan('dev', {
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

app.use(errorHandler);

export default app;
