import { User } from './user';

export interface ChatMessage {
  _id: string;
  sender: User;
  content: string;
  type: 'text' | 'system';
  createdAt: string;
  readBy: string[];
}

export interface ChatConversation {
  _id: string;
  createdBy: User;
  assignedTo?: User;
  participants: User[];
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageAt?: string;
  type: 'support' | 'admin' | 'internal';
  status: 'active' | 'resolved' | 'closed';
  subject?: string;
  unreadCount: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversationList {
  data: ChatConversation[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
}

export interface ChatMessagesPayload {
  chatId: string;
  messages: ChatMessage[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
}
