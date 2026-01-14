import dotenv from 'dotenv';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import app from './index';
import logger from './libs/logger';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: '*' },
});

// attach io to the express app so endpoints can use it (see /api/broadcast)
app.set('io', io);

io.on('connection', (socket: Socket) => {
  logger.info(`socket connected: ${socket.id}`);

  socket.on('chat message', (msg: string) => {
    // broadcast received chat messages to all clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', (reason) => {
    logger.info(`socket disconnected: ${socket.id} (${reason})`);
  });
});

server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

export default server;
