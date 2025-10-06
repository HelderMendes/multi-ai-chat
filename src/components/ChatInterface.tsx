'use client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { Link, Sparkles, ChevronDown, Send } from 'lucide-react';
import React, {
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  FormEvent,
} from 'react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { aiOptions } from '@/constants/data';
import { Card, CardContent } from './ui/card';
import { AIProvider, Message, User } from '@/types';
import MessageList from './MessageList';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface ChatInterfaceProps {
  messages: Message[];
  isAnonymous: boolean;
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  selectedAI: AIProvider;
  setSelectedAI: Dispatch<SetStateAction<AIProvider>>;
  user: User | null;
  currentChatId: string | null;
  createNewChat: () => Promise<string | null>;
  routerPush: (url: string) => void;
}

const ChatInterface = ({
  messages,
  isAnonymous,
  isLoading,
  sendMessage,
  selectedAI,
  setSelectedAI,
  user,
  currentChatId,
  createNewChat,
  routerPush,
}: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // const isAnonymous = true; // Replace with actual authentication logic
  const currentAI =
    aiOptions.find((ai) => ai.id === selectedAI) || aiOptions[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim || isLoading) return;

    try {
      if (user && !isAnonymous && !currentChatId) {
        const newChatId = await createNewChat();

        if (newChatId && newChatId !== 'anonymous') {
          await sendMessage(inputMessage);
          setInputMessage('');
          inputRef.current?.focus();
          routerPush(`/chat/${newChatId}`);
        } else {
          throw new Error('Failed to create a new chat.');
        }
      } else {
        await sendMessage(inputMessage);
        setInputMessage('');
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-screen w-full flex-col">
      {/* Header */}
      <header className="bg-card/50 supports-[backdrop-filter]:bg-card/60 z-1 border-b px-4 backdrop-blur">
        <div className="flex h-16 items-center justify-between">
          <Link href={'/'} className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="ml-8 flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 lg:ml-0">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <div className="flex">
                  <h1 className="hidden text-lg font-semibold sm:block">
                    AI Chat Hub
                  </h1>
                  <Badge
                    variant={isAnonymous ? 'secondary' : 'default'}
                    className="border-primary/50 border md:ml-2"
                  >
                    {isAnonymous ? 'Anonymous' : 'Signed In'}
                  </Badge>
                </div>
                <p className="text-muted-foreground hidden text-xs sm:block">
                  Multiple AI assistants in one place
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={'outline'}
                  className="max-w-[200px] justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`rounded-sm bg-gradient-to-r p-1 ${currentAI.color}`}
                    >
                      <currentAI.icon className="size-4 text-white" />
                    </div>
                  </div>
                  <span>{currentAI.name}</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-1">
                {aiOptions?.map((ai) => (
                  <DropdownMenuItem
                    key={ai.id}
                    onClick={() => {
                      setSelectedAI(ai.id);
                    }}
                    className="bg-accent first:pt-3 last:pb-3"
                  >
                    <div className="hover:bg-accent/50 bg-accent/75 flex items-center space-x-3 p-3">
                      <div
                        className={`size-8 rounded-lg bg-gradient-to-r ${ai.color} mt-2 flex items-center justify-center`}
                      >
                        <ai.icon className="size-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-medium">{ai?.name}</h2>
                        <p className="text-muted-foreground text-xs">
                          {ai.description}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex flex-1 px-4 py-6" ref={scrollRef}>
        <div className="full flex w-full flex-col justify-between space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="">
              <div className="mb-6 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div className="">
                    <h3 className="text-primary mb-1 font-semibold">
                      Welcome to Multiple AI Chat Hub! 🎉
                    </h3>
                    <p className="text-primary/80 mb-2 text-sm">
                      {isAnonymous
                        ? "You are chatting Anonymously. Messages wont't be save unless you sign in. "
                        : "You're signed in! Your chat history will be save automatically. "}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-lg bg-white/10 px-2 py-1 text-xs">
                        💬 Type a message below to start!
                      </span>
                      <span className="inline-flex items-center rounded-lg bg-white/10 px-2 py-1 text-xs">
                        🧞‍♂️ Switch Ai models anytime
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Ideas */}
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="space-y-4 text-center">
                    <div
                      className={`mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-r ${currentAI.color}`}
                    >
                      <currentAI.icon className="text-primary size-6" />
                    </div>

                    <div className="">
                      <h3 className="mb-2 text-lg font-semibold">
                        Chat with {currentAI.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {currentAI.description}
                      </p>
                    </div>

                    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-2 pt-4 sm:grid-cols-2">
                      {[
                        'What can you help me with?',
                        'Explain quantum computing in simple terms',
                        'Got any creative ideas for a 10 year old’s birthday?',
                        'How do I make an HTTP request in Javascript?',
                        'Help me code a component function in React',
                      ].map((prompt, index) => (
                        <Button
                          value={''}
                          key={index}
                          variant="ghost"
                          size="lg"
                          className="h-auto justify-start border p-3 text-left"
                          onClick={() => setInputMessage(prompt)}
                        >
                          <span className="">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Messages */}
          {messages?.length > 0 && (
            <Card className="flex1">
              <ScrollArea className="h-[70vh] p-4" ref={scrollRef}>
                <MessageList
                  messages={messages}
                  isLoading={isLoading}
                  currentAI={currentAI}
                />
              </ScrollArea>
            </Card>
          )}

          {/* Input Area */}
          {/* <Card className="z-50 shadow-[0_0_24px_8px_rgba(120,0,255,0.10)]"> */}
          <Card className="shadow-6xl z-50 shadow-black/80">
            <CardContent className="pt-2">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <div className="flex-1">
                  <Textarea
                    placeholder={`Message ${currentAI?.name}...`}
                    ref={inputRef}
                    value={inputMessage}
                    className="bg-background w-full rounded-md rounded-br-none border-0 px-2 py-1 ring-0 focus:ring-0 disabled:cursor-not-allowed"
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                    rows={2}
                  />
                </div>
                <Button
                  type="submit"
                  className="flex size-10 items-center justify-center rounded-bl-none pt-1"
                  size={'icon'}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
