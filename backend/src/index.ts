import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './libs/logger';
import apiResponse from './middlewares/response';

dotenv.config();

const app = express();

// Basic security + parsing + CORS
app.use(helmet());
app.use(cors());
app.use(express.json());

// HTTP request logging -> forward to winston
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// API response helpers (res.success, res.error)
app.use(apiResponse);

// Health
app.get('/', (_req: Request, res: Response) => res.send('Server is up'));

// Example JSON endpoint
app.get('/api/ping', (_req: Request, res: Response) =>
  res.json({ pong: true })
);

// Example endpoint that broadcasts a message via sockets (if Socket.IO is attached to app)
app.post('/api/broadcast', (req: Request, res: Response) => {
  const io = req.app.get('io');
  const { message } = req.body || { message: null };

  if (!message) return res.status(400).json({ error: 'message is required' });

  if (io) {
    io.emit('chat message', message);
    return res.json({ ok: true });
  }

  // If sockets are not attached yet, respond gracefully
  return res.status(503).json({ error: 'socket server not available' });
});

// Basic error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack || err.message || String(err));
  res.status(500).json({ error: 'internal server error' });
});

export default app;
