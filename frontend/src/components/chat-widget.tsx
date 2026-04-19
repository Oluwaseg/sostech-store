'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import {
  useChatMessages,
  useMarkChatRead,
  useSendChatMessage,
  useSupportChat,
} from '@/hooks/use-chat';
import { ChatMessage } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const formatTime = (isoDate?: string) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ChatWidget() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { socket, isConnected, joinChat, leaveChat, sendTyping, stopTyping } =
    useSocket();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [page] = useState(1);
  const [pageSize] = useState(50);
  const [chatId, setChatId] = useState<string | null>(null);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState<string | null>(null);
  const [realTimeMessages, setRealTimeMessages] = useState<ChatMessage[]>([]);

  const {
    mutateAsync: createSupportChat,
    data: supportChat,
    isPending: creatingSupport,
    isSuccess: supportChatLoaded,
  } = useSupportChat();

  const messagesQuery = useChatMessages(chatId ?? '', page, pageSize);
  const sendMessageMutation = useSendChatMessage(chatId ?? '');
  const markReadMutation = useMarkChatRead(chatId ?? '');

  const messages = messagesQuery.data?.messages || [];
  const isLoadingMessages = messagesQuery.isLoading || messagesQuery.isFetching;

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated && !supportChat && !creatingSupport) {
      createSupportChat().catch((error) => {
        toast.error(error.message || 'Could not open support chat');
      });
    }
  }, [
    createSupportChat,
    isAuthenticated,
    isOpen,
    supportChat,
    creatingSupport,
  ]);

  useEffect(() => {
    if (supportChat?._id && !hasMarkedRead) {
      setChatId(supportChat._id);
      markReadMutation.mutate();
      setHasMarkedRead(true);
    }
  }, [supportChat, hasMarkedRead, markReadMutation]);

  useEffect(() => {
    if (!socket || !chatId || !isConnected) return;

    joinChat(chatId);

    return () => {
      leaveChat(chatId);
    };
  }, [socket, chatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleMessageCreated = (payload: {
      chatId: string;
      message: ChatMessage;
    }) => {
      if (payload.chatId !== chatId) return;

      setRealTimeMessages((prev) =>
        prev.some((m) => m._id === payload.message._id)
          ? prev
          : [...prev, payload.message]
      );

      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
    };

    const handleUserTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== chatId) return;
      setSomeoneTyping('Support team is typing...');
    };

    const handleStopTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== chatId) return;
      setSomeoneTyping(null);
    };

    socket.on('message.created', handleMessageCreated);
    socket.on('user.typing', handleUserTyping);
    socket.on('user.stop-typing', handleStopTyping);

    return () => {
      socket.off('message.created', handleMessageCreated);
      socket.off('user.typing', handleUserTyping);
      socket.off('user.stop-typing', handleStopTyping);
    };
  }, [socket, chatId, queryClient]);

  const hasMessages = messages.length > 0;

  // Combine API messages with real-time messages
  const allMessages = useMemo(() => {
    const combined = [...messages, ...realTimeMessages];
    // Remove duplicates based on _id
    const unique = combined.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m._id === message._id)
    );
    // Sort by createdAt
    return unique.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages, realTimeMessages]);

  useEffect(() => {
    if (!isOpen) return;
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [allMessages.length, isOpen]);

  // Socket event listeners

  const handleSend = async () => {
    if (!draft.trim()) {
      return;
    }
    if (!chatId) {
      toast.error('Unable to send message yet. Please wait for chat to start.');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync(draft.trim());
      setDraft('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const content = useMemo(() => {
    if (authLoading) {
      return (
        <div className='flex h-full items-center justify-center'>
          <div className='text-center space-y-3'>
            <div className='flex justify-center'>
              <div className='relative h-8 w-8'>
                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 to-primary/20 animate-pulse'></div>
                <div
                  className='absolute inset-1 rounded-full bg-gradient-to-r from-primary/60 to-primary/30 animate-spin'
                  style={{ animationDuration: '2s' }}
                ></div>
              </div>
            </div>
            <p className='text-xs text-muted-foreground font-medium'>
              Checking authentication...
            </p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className='flex h-full flex-col items-center justify-center gap-6 p-8 text-center'>
          <div className='relative'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl'></div>
            <div className='relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20'>
              <svg
                className='h-8 w-8 text-primary'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
          </div>
          <div className='space-y-2'>
            <p className='text-sm font-semibold text-foreground'>
              Sign in to chat
            </p>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              Connect with our support team to get instant help and answers
            </p>
          </div>
          <Link href='/login' className='w-full'>
            <Button className='w-full h-10 rounded-lg bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200'>
              Sign in now
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className='flex h-full flex-col overflow-hidden bg-background'>
        {/* Loading State */}
        {creatingSupport || isLoadingMessages ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center space-y-3.5'>
              <div className='flex justify-center gap-2'>
                <div
                  className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary'
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary'
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary'
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
              <p className='text-xs text-muted-foreground font-medium'>
                {creatingSupport ? 'Opening chat...' : 'Loading messages...'}
              </p>
            </div>
          </div>
        ) : !allMessages.length ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
            <div className='relative'>
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl'></div>
              <div className='relative rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20'>
                <svg
                  className='h-7 w-7 text-primary'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-3l-4 4z'
                  />
                </svg>
              </div>
            </div>
            <div className='space-y-1.5'>
              <p className='text-sm font-semibold text-foreground'>
                Start a conversation
              </p>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                Say hello! Our support team is ready to help you.
              </p>
            </div>
          </div>
        ) : (
          <div
            ref={listRef}
            className='flex-1 space-y-3 overflow-y-auto px-4 py-6'
          >
            {allMessages.map((message: ChatMessage, idx) => {
              const isMine = message.sender._id === supportChat?.createdBy._id;
              return (
                <div
                  key={message._id}
                  className={`flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {!isMine && (
                    <span className='text-xs font-semibold text-muted-foreground px-2'>
                      {message.sender.name}
                    </span>
                  )}
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md transition-all duration-200 hover:shadow-lg ${
                      isMine
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground ml-auto rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-foreground rounded-bl-none border border-border/50'
                    }`}
                  >
                    {message.content}
                  </div>
                  <span
                    className={`text-xs transition-opacity ${
                      isMine
                        ? 'text-right pr-2 text-muted-foreground'
                        : 'pl-2 text-muted-foreground/60'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              );
            })}
            {someoneTyping && (
              <div className='flex items-start gap-2 animate-in fade-in duration-200'>
                <div className='rounded-2xl rounded-bl-none bg-white dark:bg-slate-800 px-4 py-3 border border-border/50 shadow-md'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-1.5'>
                      <div className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary'></div>
                      <div
                        className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area - Premium styling */}
        <div className='border-t border-border/30 bg-gradient-to-t from-background/95 to-background px-4 py-4'>
          <div className='flex gap-2.5'>
            <div className='flex-1 relative'>
              <Textarea
                className='max-h-20 min-h-11 resize-none rounded-xl border border-border/50 bg-white dark:bg-slate-800 text-sm placeholder-muted-foreground/70 focus:border-primary/50 focus:ring-primary/30 transition-all shadow-sm focus:shadow-md'
                placeholder='Type a message...'
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={!chatId || sendMessageMutation.isPending}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={
                !draft.trim() || !chatId || sendMessageMutation.isPending
              }
              size='sm'
              className='mt-auto h-11 w-11 rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {sendMessageMutation.isPending ? (
                <div className='flex gap-1.5'>
                  <div className='h-1.5 w-1.5 animate-bounce rounded-full bg-white'></div>
                  <div
                    className='h-1.5 w-1.5 animate-bounce rounded-full bg-white'
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                </div>
              ) : (
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z' />
                </svg>
              )}
            </Button>
          </div>
          {!chatId && (
            <p className='mt-2.5 text-xs text-muted-foreground/70 animate-pulse'>
              Getting ready...
            </p>
          )}
        </div>
      </div>
    );
  }, [
    authLoading,
    chatId,
    creatingSupport,
    draft,
    handleSend,
    hasMessages,
    isAuthenticated,
    isLoadingMessages,
    messages,
    sendMessageMutation.isPending,
    supportChat,
    someoneTyping,
  ]);

  return (
    <>
      {/* Vertical Pill Widget - Always visible */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className='fixed right-0 top-1/2 -translate-y-1/2 z-50 group flex h-48 w-14 flex-col items-center justify-center gap-3 rounded-l-2xl border border-r-0 border-primary/20 bg-gradient-to-b from-primary via-primary to-primary/90 px-3 py-4 text-primary-foreground shadow-2xl shadow-primary/25 backdrop-blur-md transition-all duration-300 ease-out hover:w-20 hover:shadow-2xl hover:shadow-primary/35 focus:outline-none'
      >
        {/* Message count badge - animated */}
        {allMessages.length > 0 && isAuthenticated && !isOpen && (
          <div className='absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg shadow-red-500/50 animate-bounce'>
            {allMessages.length > 9 ? '9+' : allMessages.length}
          </div>
        )}

        {/* Chat Icon */}
        <div className='flex items-center justify-center transition-transform duration-300 group-hover:scale-110'>
          <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' />
          </svg>
        </div>

        {/* Vertical Text */}
        <p
          className='text-xs font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity'
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Chat
        </p>

        {/* Online indicator dot */}
        <div className='h-2 w-2 rounded-full bg-white/60 shadow-sm group-hover:bg-white transition-colors'></div>
      </button>

      {/* Expanded Chat Panel - Slides in from right with premium effects */}
      {isOpen && (
        <>
          {/* Overlay - enhanced blur */}
          <div
            className='fixed inset-0 z-40 bg-black/30 backdrop-blur-xl animate-in fade-in duration-300'
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Panel - Premium styling */}
          <div className='fixed right-0 top-0 z-50 h-screen w-96 max-w-[calc(100vw-48px)] overflow-hidden rounded-l-3xl bg-gradient-to-b from-background to-background/95 shadow-2xl shadow-black/30 animate-in slide-in-from-right duration-400 ease-out'>
            {/* Header - Premium gradient */}
            <div className='relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/85 px-6 py-5 text-primary-foreground shadow-lg shadow-primary/20'>
              <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl'></div>
              </div>

              <div className='relative flex items-start justify-between'>
                <div className='flex-1'>
                  <h2 className='text-base font-bold leading-tight'>
                    Support Team
                  </h2>
                  <p className='mt-1 text-xs opacity-85'>
                    We typically reply in minutes
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label='Close chat'
                  className='relative ml-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 transition-all duration-200 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2.5}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Content with premium scroll styling */}
            <div className='h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40'>
              {content}
            </div>
          </div>
        </>
      )}
    </>
  );
}
