import dotenv from 'dotenv';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { connectDB } from './configs/db';
import app from './index';
import logger from './libs/logger';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: '*' },
});

app.set('io', io);

io.on('connection', (socket: Socket) => {
  logger.info(`socket connected: ${socket.id}`);

  socket.on('chat message', (msg: string) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', (reason) => {
    logger.info(`socket disconnected: ${socket.id} (${reason})`);
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error(
      `Failed to start server: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
};

startServer();

export default server;
