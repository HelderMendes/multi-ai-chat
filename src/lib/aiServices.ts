import type { AIProvider } from '@/types';

interface AIServiceResponse {
  text: string;
  success: boolean;
  error?: string;
}

// Valid model types for each provider
type ChatGPTModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4o-2024-08-08';
type ClaudeModel =
  | 'claude-sonnet-4-5-20250929' // ✅ Claude 4.5 (smartest)
  | 'claude-sonnet-4-20250514' // ✅ Claude 4
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-opus-20240229'
  | 'claude-3-haiku-20240307';
type GeminiModel = 'gemini-1.5-flash' | 'gemini-1.5-pro';
type GrokModel = 'grok-4' | 'grok-3' | 'grok-3-mini';
type LlamaModel = 'llama3:8b' | 'llama2' | 'mistral' | 'mixtral';

export const AIService = {
  async callChatGPT(
    message: string,
    model: ChatGPTModel = 'gpt-4o'
  ): Promise<AIServiceResponse> {
    if (!message.trim()) {
      return { text: '', success: false, error: 'Message is required' };
    }
    try {
      const response = await fetch('/api/ai/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, model }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        text: data.text || 'No response from ChatGPT received.',
        success: true,
      };
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      return {
        text: '',
        success: false,
        error:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'Failed to get response from ChatGPT.',
      };
    }
  },

  async callClaude(
    message: string,
    model: ClaudeModel = 'claude-sonnet-4-20250514'
  ): Promise<AIServiceResponse> {
    if (!message.trim()) {
      return { text: '', success: false, error: 'Message is required' };
    }
    try {
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, model }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        text: data.text || 'No response from Claude received.',
        success: true,
      };
    } catch (error) {
      console.error('Error calling Claude API:', error);
      return {
        text: '',
        success: false,
        error:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'Failed to get response from Claude.',
      };
    }
  },

  async callGemini(
    message: string,
    model: GeminiModel = 'gemini-1.5-flash'
  ): Promise<AIServiceResponse> {
    if (!message.trim()) {
      return { text: '', success: false, error: 'Message is required' };
    }
    try {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, model }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        text: data.text || 'No response from Gemini received.',
        success: true,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        text: '',
        success: false,
        error:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'Failed to get response from Gemini.',
      };
    }
  },

  async callGrok(
    message: string,
    model: GrokModel = 'grok-4'
  ): Promise<AIServiceResponse> {
    if (!message.trim()) {
      return {
        text: '',
        success: false,
        error: 'Message is required',
      };
    }

    try {
      const response = await fetch('/api/ai/grok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, model }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        text: data.text || 'No response from Grok received.',
        success: true,
      };
    } catch (error) {
      console.error('Error calling Grok API:', error);
      return {
        text: '',
        success: false,
        error:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'Failed to get response from Grok.',
      };
    }
  },

  async callLlama(
    message: string,
    model: LlamaModel = 'llama3:8b'
  ): Promise<AIServiceResponse> {
    if (!message.trim()) {
      return { text: '', success: false, error: 'Message is required' };
    }
    try {
      const res = await fetch('/api/ai/llama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Llama API call failed');
      }

      return {
        text: data.text || 'No response from Llama received.',
        success: true,
      };
    } catch (err) {
      console.error('AIService.callLlama error:', err);
      return {
        text: '',
        success: false,
        error:
          typeof err === 'object' && err !== null && 'message' in err
            ? (err as { message: string }).message
            : 'Failed to get response from Llama.',
      };
    }
  },

  // ✅ Fixed: Proper typing with union type
  async callAI(
    provider: AIProvider,
    message: string,
    model?: ChatGPTModel | ClaudeModel | GeminiModel | GrokModel | LlamaModel
  ): Promise<AIServiceResponse> {
    switch (provider) {
      case 'chatgpt':
        return this.callChatGPT(message, model as ChatGPTModel);
      case 'claude':
        return this.callClaude(message, model as ClaudeModel);
      case 'gemini':
        return this.callGemini(message, model as GeminiModel);
      case 'grok':
        return this.callGrok(message, model as GrokModel);
      case 'llama': {
        return this.callLlama(message, model as LlamaModel);
      }
      default:
        return {
          text: '',
          success: false,
          error: `Unsupported AI provider: ${provider}`,
        };
    }
  },
};
