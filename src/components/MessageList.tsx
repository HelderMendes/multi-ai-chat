'use client';

import { Bot, User } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { AIOption, Message } from '@/types';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Badge } from './ui/badge';

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
  currentAI: AIOption;
};

export default function MessageList({
  messages,
  isLoading,
  currentAI,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages?.map((message) => (
        <div
          key={message?.id}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[98%] space-x-2 ${
              message.sender === 'user'
                ? 'flex-row-reverse space-x-reverse'
                : ''
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className={
                  message.sender === 'user'
                    ? 'bg-blue-500'
                    : `bg-gradient-to-r ${currentAI.color}`
                }
              >
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </AvatarFallback>
            </Avatar>
            <Card
              className={
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }
            >
              <CardContent className="px-3">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message?.text}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {message.sender === 'user' ? 'You' : currentAI.name}
                  </Badge>
                  <span className="text-xs opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex max-w-[98%] space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={`bg-gradient-to-r ${currentAI.color}`}>
                <Bot className="h-4 w-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <Card>
              <CardContent className="px-3">
                <div className="flex items-center justify-center gap-1">
                  <div className="bg-muted-foreground size-2 animate-bounce rounded-full" />
                  <div
                    className="bg-muted-foreground size-2 animate-bounce rounded-full"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="bg-muted-foreground size-2 animate-bounce rounded-full"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
