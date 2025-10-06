import { AIOption } from '@/types';
import { Brain, Cpu, MessageCircle, Zap, BrainCog } from 'lucide-react';

export const aiOptions: AIOption[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: MessageCircle,
    color: 'from-green-400 to-emerald-500',
    description: "OpenAI's powerful language model",
  },

  {
    id: 'grok',
    name: 'Grok',
    icon: Zap,
    color: 'from-blue-400 to-purple-500',
    description: "X's witty AI companion",
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: Cpu,
    color: 'from-pink-400 to-rose-500',
    description: "Google's multimodal AI",
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: Brain,
    color: 'from-orange-400 to-red-500',
    description: "Anthropic's helpful AI assistant",
  },
  {
    id: 'llama',
    name: 'Llama',
    icon: BrainCog,
    color: 'from-yellow-400 to-amber-500',
    description: 'Meta AI models like Llama 2 and Mistral',
  },
];
