'use client';

import { useAuth } from '@/contexts/auth-context';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (conversationId: string) => void;
  leaveChat: (conversationId: string) => void;
  sendTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Build backend socket URL from the API base URL.
    // If NEXT_PUBLIC_API_URL includes /api, strip it so Socket.IO connects to the root socket namespace.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3025';
    const socketUrl = apiUrl.replace(/\/api\/?$/, '');

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  const joinChat = (conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat.join', { conversationId });
    }
  };

  const leaveChat = (conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat.leave', { conversationId });
    }
  };

  const sendTyping = (conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat.typing', { conversationId });
    }
  };

  const stopTyping = (conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat.stop-typing', { conversationId });
    }
  };

  const value: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    joinChat,
    leaveChat,
    sendTyping,
    stopTyping,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
