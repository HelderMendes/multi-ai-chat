'use client';

import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SingleChatPage = () => {
  const {
    messages,
    selectChat,
    currentChatId,
    isAnonymous,
    isLoading,
    chats,
    createNewChat,
    sendMessage,
    selectedAI,
    setSelectedAI,
  } = useChat();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const chatId = params?.ai;

  useEffect(() => {
    if (chatId && typeof chatId === 'string' && chatId !== currentChatId) {
      selectChat(chatId);
    }
  }, [chatId, currentChatId, selectChat]);

  // Redirect to chat when ever the chat is deleted (index is direct upload in to Firestore database)
  useEffect(() => {
    if (currentChatId && chats.length > 0) {
      const chatExists = chats.some((chat) => chat.id === currentChatId);
      if (!chatExists) {
        router.push('/');
      }
    }
  }, [chats, currentChatId, router]);

  return (
    <div className="flex-1">
      <ChatInterface
        messages={messages}
        isAnonymous={isAnonymous}
        isLoading={isLoading}
        sendMessage={sendMessage}
        selectedAI={selectedAI}
        setSelectedAI={setSelectedAI}
        currentChatId={currentChatId}
        createNewChat={createNewChat}
        user={user}
        routerPush={router.push}
      />
    </div>
  );
};

export default SingleChatPage;
