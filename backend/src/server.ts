import dotenv from 'dotenv';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { connectDB, disconnectDB } from './configs/db';
import app from './index';
import logger from './libs/logger';
import { verifyToken } from './utils/jwt';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

app.set('io', io);

const getCookieValue = (
  cookieHeader: string | undefined,
  name: string
): string | undefined => {
  if (!cookieHeader) return undefined;
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1];
};

/**
 * Socket.IO Authentication & Connection Handler
 * Clients should connect with headers: { Authorization: 'Bearer <token>' }
 * or via query params: ?token=<token>
 */
io.on('connection', (socket: Socket) => {
  try {
    // Extract token from headers, query params, or HTTP-only cookie
    const cookieName = process.env.JWT_COOKIE_NAME || 'token';
    const token =
      (socket.handshake.headers.authorization as string)?.split(' ')[1] ||
      (socket.handshake.query.token as string) ||
      getCookieValue(
        socket.handshake.headers.cookie as string | undefined,
        cookieName
      );

    if (!token) {
      logger.warn(`Socket connection rejected: no token (${socket.id})`);
      socket.disconnect();
      return;
    }

    // Verify token
    const payload = verifyToken(token);
    const userId = payload.userId;

    // Attach user info to socket
    (socket as any).user = payload;

    if (payload.role === 'admin' || payload.role === 'moderator') {
      socket.join('admins');
    }

    logger.info(`Socket connected: ${socket.id} (user: ${userId})`);

    // ====== JOIN CONVERSATION ROOM ======
    /**
     * Client emits: chat.join with { conversationId }
     * Server: adds socket to room named after the conversationId
     */
    socket.on('chat.join', (data: { conversationId: string }) => {
      const { conversationId } = data;
      if (!conversationId) {
        socket.emit('error', { message: 'conversationId required' });
        return;
      }

      socket.join(conversationId);
      logger.info(`User ${userId} joined conversation: ${conversationId}`);

      // Notify other participants
      socket.to(conversationId).emit('user.joined', {
        userId,
        conversationId,
        timestamp: new Date(),
      });
    });

    // ====== LEAVE CONVERSATION ROOM ======
    /**
     * Client emits: chat.leave with { conversationId }
     * Server: removes socket from room
     */
    socket.on('chat.leave', (data: { conversationId: string }) => {
      const { conversationId } = data;
      if (!conversationId) return;

      socket.leave(conversationId);
      logger.info(`User ${userId} left conversation: ${conversationId}`);

      // Notify remaining participants
      socket.to(conversationId).emit('user.left', {
        userId,
        conversationId,
        timestamp: new Date(),
      });
    });

    // ====== TYPING INDICATOR ======
    /**
     * Client emits: chat.typing with { conversationId }
     * Server: broadcasts to room (except sender)
     */
    socket.on('chat.typing', (data: { conversationId: string }) => {
      const { conversationId } = data;
      if (!conversationId) return;

      socket.to(conversationId).emit('user.typing', {
        userId,
        conversationId,
        timestamp: new Date(),
      });
    });

    // ====== STOP TYPING ======
    /**
     * Client emits: chat.stop-typing with { conversationId }
     */
    socket.on('chat.stop-typing', (data: { conversationId: string }) => {
      const { conversationId } = data;
      if (!conversationId) return;

      socket.to(conversationId).emit('user.stop-typing', {
        userId,
        conversationId,
      });
    });

    // ====== DISCONNECT HANDLER ======
    socket.on('disconnect', (reason) => {
      logger.info(
        `Socket disconnected: ${socket.id} (user: ${userId}, reason: ${reason})`
      );
    });

    // ====== ERROR HANDLER ======
    socket.on('error', (error) => {
      logger.error(`Socket error on ${socket.id}: ${error}`);
    });
  } catch (error) {
    logger.error(`Socket auth error: ${error}`);
    socket.disconnect();
  }
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  server.close(async (error) => {
    if (error) {
      logger.error(`Error closing server: ${error.message}`);
      process.exit(1);
    }

    await disconnectDB();
    logger.info('Shutdown complete');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

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
