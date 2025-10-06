import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';
import React from 'react';

const AppLoading = () => {
  const { loading: authLoading } = useAuth();
  if (!authLoading) {
    return null;
  }
  return (
    <div className="bg-background/90 fixed top-0 left-0 z-50 flex min-h-screen w-full items-center justify-center">
      <div className="text-center text-white">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
          <Sparkles className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Loading AI Chat Hub...</h2>
        <p className="text-gray-400">Initializing your chat experience</p>
      </div>
    </div>
  );
};

export default AppLoading;
