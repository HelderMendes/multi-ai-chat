import { ComponentType, SVGProps } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  ai: AIProvider;
  userId?: string;
  chatId: string;
}

export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  aiProvider: AIProvider;
  messageCount: number;
  lastMessage?: string;
  isAnonymous?: boolean;
}

export type AIProvider = 'chatgpt' | 'claude' | 'grok' | 'gemini' | 'llama';

export interface AIOption {
  id: AIProvider;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  description?: string;
  model?: string;
}

export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  isAnonymous: boolean;
  emailVerified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

export interface APIResponse {
  success: boolean;
  message?: string;
  error?: string;
}
