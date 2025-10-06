'use client';

import {
  LogIn,
  LogOut,
  MessageCircle,
  Plus,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { ScrollArea } from './ui/scroll-area';
import { Chat } from '@/types';
import { toast } from 'sonner';

const ChatSideBar = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false); // For testing, set to true
  const {
    currentChatId,
    createNewChat,
    deleteChat,
    isAnonymous,
    chats,
    selectChat,
  } = useChat();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();
  // const isAnonymous = user?.isAnonymous ?? true;
  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId && newChatId !== 'anonymous') {
      router.push(`/chat/${newChatId}`);
    } else if (newChatId === 'anonymous') {
      router.push(`/chat`);
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      // await createNewChat(); //
      router.push('/');
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const SideBarContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Link href="/" className="mb-4 flex items-center space-x-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="size-6 text-white" />
          </div>
          <span className="font-semibold">Multi AI Chat</span>
        </Link>

        <Button
          className="w-full"
          variant={'outline'}
          onClick={handleNewChat}
          disabled={isAnonymous}
        >
          <Plus className="" />
          {isAnonymous ? 'New Conversation' : 'New Chat'}
        </Button>
      </div>
      <Separator />
      {/* Anonymous User Notice */}
      {isAnonymous && (
        <div className="p-4 text-sm text-gray-500">
          <Card className="border">
            <CardContent className="p-3">
              <p className="text-destructive mb-2 text-sm">
                You&apos;re chatting anonymously
              </p>
              <p className="mb-3 text-xs">Sign in to save your chat history!</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('signin');
                }}
              >
                <LogIn />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full">
          {chats?.length === 0 ? (
            <div className="py-8 text-center">
              <MessageCircle className="text-muted-foreground mx-auto mb-2 size-8" />
              <p className="text-muted-foreground text-sm">
                {isAnonymous
                  ? 'You have no save chats yet.'
                  : 'You have no save chats yet'}
              </p>
              <p className="text-muted-foreground text-sm">
                {isAnonymous
                  ? 'Sign in to save your chats!'
                  : 'Start a new conversation to see your chat here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats?.map((chat: Chat) => (
                <Card
                  key={chat.id}
                  className={`group cursor-pointer rounded-md py-4 transition-colors ${chat.id === currentChatId ? 'bg-accent border-accent-foreground' : 'hover:bg-red/50'}`}
                  onClick={() => {
                    selectChat(chat.id);
                    router.push(`/chat/${chat.id}`);
                  }}
                >
                  <CardContent className="px-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <h4 className="line-clamp-2 text-sm font-medium">
                          {chat.title || 'Untitled Chat'}
                        </h4>
                        <p className="flex justify-between text-xs text-gray-500">
                          <Badge variant="secondary">{chat.aiProvider} </Badge>
                          <span className="text-muted-foreground">
                            {chat.messageCount} messages
                          </span>
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </p>
                        {/* <div className="mt-2 flex items-center space-x-2">
                          <Badge variant="secondary">{chat.aiProvider}</Badge>
                        </div> */}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="-mr-2 ml-1 size-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                          toast.success('Chat deleted successfully', {
                            position: 'bottom-right',
                          });
                        }}
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      <Separator />
      {/* User Info... */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="size-10">
              <AvatarFallback
                className={isAnonymous ? 'bg-yellow-500' : 'bg-blue-500'}
              >
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="min-h-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">
                {user?.displayName || 'Anonymous Guest User'}
              </p>

              <div className="mt-0.75 flex items-center space-x-1">
                <Badge variant={isAnonymous ? 'secondary' : 'default'}>
                  {isAnonymous ? 'Anonymous' : 'Signed In'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="">
            {isAnonymous ? (
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('signin');
                }}
              >
                <LogIn className="size-4" />
              </Button>
            ) : (
              <Button variant={'ghost'} size={'icon'} onClick={handleSignOut}>
                <LogOut className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-h-screen">
      <div className="hidden h-full lg:flex lg:w-80 lg:flex-col lg:border-r">
        <SideBarContent />
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() =>
          setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
        }
      />
    </div>
  );
};

export default ChatSideBar;
