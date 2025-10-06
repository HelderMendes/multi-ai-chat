import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1', // xAI's OpenAI-compatible endpoint
});

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'grok-4' } = await request.json(); // Use requested model, default to grok-4
    // const { message, model = 'qwen3-coder:480b-cloud' } = await request.json(); // Use requested model, default to grok-4

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROK_API_KEY) {
      return NextResponse.json(
        { error: 'xAI API key is required' },
        { status: 500 }
      );
    }

    // Validate model (add more as needed from https://docs.x.ai/docs/models)
    const validModels = ['grok-4', 'grok-3', 'grok-3-mini'];
    if (!validModels.includes(model)) {
      return NextResponse.json(
        {
          error: `Invalid model: ${model}. Use one of: ${validModels.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model,
      stream: false,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const text =
      response.choices?.[0]?.message?.content || 'No response received';

    return NextResponse.json({ text });
  } catch (error) {
    console.error('xAI Grok API error:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to get response from Grok';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
