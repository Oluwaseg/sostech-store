'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useSocket } from '@/contexts/socket-context';
import {
  useAdminActiveChats,
  useChatConversation,
  useChatMessages,
  useSendChatMessage,
} from '@/hooks/use-chat';
import { ChatConversation } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
};

export default function AdminSupportPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [page] = useState(1);
  const [pageSize] = useState(20);
  const { socket, isConnected, joinChat, leaveChat } = useSocket();
  const queryClient = useQueryClient();

  const {
    data: activeChats,
    isLoading: loadingChats,
    error: chatsError,
  } = useAdminActiveChats(page, 20);

  const selectedChatQuery = useChatConversation(selectedChatId ?? '');
  const messagesQuery = useChatMessages(selectedChatId ?? '', page, pageSize);
  const sendMessageMutation = useSendChatMessage(selectedChatId ?? '');

  const chats = activeChats?.data || [];
  const selectedChat = selectedChatQuery.data;
  const messages = messagesQuery.data?.messages || selectedChat?.messages || [];

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0]._id);
    }
  }, [chats, selectedChatId]);

  useEffect(() => {
    if (!socket || !selectedChatId || !isConnected) return;

    joinChat(selectedChatId);

    return () => {
      leaveChat(selectedChatId);
    };
  }, [socket, selectedChatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageCreated = (payload: { chatId: string }) => {
      if (payload.chatId === selectedChatId) {
        queryClient.invalidateQueries({
          queryKey: ['chat-messages', selectedChatId],
        });
        queryClient.invalidateQueries({
          queryKey: ['chat-conversation', selectedChatId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['admin-active-chats', page, pageSize],
      });
    };

    const handleChatUpdated = (payload: { chatId: string }) => {
      if (payload.chatId === selectedChatId) {
        queryClient.invalidateQueries({
          queryKey: ['chat-conversation', selectedChatId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['admin-active-chats', page, pageSize],
      });
    };

    socket.on('message.created', handleMessageCreated);
    socket.on('chat.updated', handleChatUpdated);
    socket.on('chat.assigned', handleChatUpdated);
    socket.on('chat.resolved', handleChatUpdated);
    socket.on('chat.closed', handleChatUpdated);

    return () => {
      socket.off('message.created', handleMessageCreated);
      socket.off('chat.updated', handleChatUpdated);
      socket.off('chat.assigned', handleChatUpdated);
      socket.off('chat.resolved', handleChatUpdated);
      socket.off('chat.closed', handleChatUpdated);
    };
  }, [socket, selectedChatId, page, pageSize, queryClient]);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages.length, selectedChatId]);

  const handleSelectChat = (chat: ChatConversation) => {
    setSelectedChatId(chat._id);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChatId) return;

    try {
      await sendMessageMutation.mutateAsync(message.trim());
      setMessage('');
      toast.success('Message sent to customer');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const chatCount = chats.length;
  const content = useMemo(() => {
    if (loadingChats) {
      return (
        <div className='flex min-h-[240px] items-center justify-center'>
          <Spinner className='w-8 h-8' />
        </div>
      );
    }

    if (chatsError) {
      return (
        <div className='p-6 text-sm text-red-600'>
          Failed to load support chats. Please refresh.
        </div>
      );
    }

    if (chats.length === 0) {
      return (
        <div className='p-6 text-sm text-muted-foreground'>
          No active support conversations at the moment.
        </div>
      );
    }

    return (
      <div className='space-y-3'>
        {chats.map((chat) => {
          const isSelected = chat._id === selectedChatId;
          return (
            <button
              key={chat._id}
              type='button'
              onClick={() => handleSelectChat(chat)}
              className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-muted'
              }`}
            >
              <div className='flex items-center justify-between gap-2'>
                <div>
                  <p className='font-semibold text-foreground'>
                    {chat.subject || `Support #${chat._id.slice(-6)}`}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {chat.createdBy?.name || 'Unknown user'} ·{' '}
                    {chat.createdBy?.email || 'Unknown email'}
                  </p>
                </div>
                <span className='rounded-full bg-muted px-2 py-1 text-[11px] uppercase tracking-[.18em] text-muted-foreground'>
                  {chat.status}
                </span>
              </div>
              <div className='mt-3 flex items-center justify-between text-sm text-foreground/70'>
                <span>{chat.lastMessage || 'No messages yet'}</span>
                <span>
                  {chat.lastMessageAt ? formatTime(chat.lastMessageAt) : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }, [chats, chatsError, loadingChats, selectedChatId]);

  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Support Chats
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Manage active customer support conversations and reply instantly.
            </p>
          </div>
          <div className='rounded-2xl border border-border bg-card px-4 py-3 text-sm'>
            Active conversations:{' '}
            <span className='font-semibold'>{chatCount}</span>
          </div>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6'>
          <section className='rounded-3xl border border-border bg-card p-5 shadow-sm'>
            <div className='flex items-center justify-between gap-3 mb-5'>
              <div>
                <h2 className='text-lg font-semibold text-foreground'>
                  Active chats
                </h2>
                <p className='text-sm text-muted-foreground'>
                  Select a conversation to reply.
                </p>
              </div>
            </div>
            {content}
          </section>

          <section className='rounded-3xl border border-border bg-card p-5 shadow-sm flex flex-col'>
            {!selectedChat ? (
              <div className='flex min-h-[320px] items-center justify-center text-sm text-muted-foreground'>
                Select a chat to view conversation details.
              </div>
            ) : (
              <>
                <div className='mb-5 flex flex-col gap-3 border-b border-border pb-4'>
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <p className='text-base font-semibold text-foreground'>
                        {selectedChat.subject || 'Support Conversation'}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {selectedChat.createdBy?.name || 'Unknown user'} ·{' '}
                        {selectedChat.createdBy?.email || 'Unknown email'}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold text-foreground'>
                        {selectedChat.status}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Assigned to:{' '}
                        {selectedChat.assignedTo?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex-1 overflow-hidden'>
                  <div
                    ref={panelRef}
                    className='space-y-4 overflow-y-auto pr-2 pb-4 max-h-[calc(100vh-28rem)]'
                  >
                    {messages.length === 0 ? (
                      <div className='rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground'>
                        No messages yet. Write the first reply to start the
                        conversation.
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isAdmin = message.sender.role !== 'user';
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                                isAdmin
                                  ? 'bg-primary text-white'
                                  : 'bg-slate-100 text-slate-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className='mt-2 text-[11px] text-muted-foreground'>
                                {message.sender.name} •{' '}
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className='mt-5 border-t border-border pt-4'>
                  <Textarea
                    className='min-h-[120px]'
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder='Write a response to the customer...'
                  />
                  <div className='mt-4 flex items-center justify-between gap-3'>
                    <span className='text-xs text-muted-foreground'>
                      {selectedChat.participants.length} participant(s)
                    </span>
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        !message.trim() || sendMessageMutation.isPending
                      }
                    >
                      Send reply
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
