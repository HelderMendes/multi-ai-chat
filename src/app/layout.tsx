import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import ChatSideBar from '@/components/ChatSideBar';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Multi AI Chat - Hub for AI Assistants',
  description:
    'Chat with ChatGPT, Claude, Grok, and Gemini all in one place. Multiple AI assistants with seamless switching and conversation history.',
  keywords: [
    'AI chat',
    'ChatGPT',
    'Claude',
    'Grok',
    'Gemini',
    'AI assistant',
    'conversation',
  ],
  authors: [{ name: 'Multi AI Chat' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen">
              <ChatSideBar />
              {children}
            </div>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
