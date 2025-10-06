import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'claude-sonnet-4-20250514' } =
      await request.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      messages: [{ role: 'user', content: message }],
      model,
      max_tokens: 1000,
      temperature: 0.7,
    });
    const text =
      response.content[0]?.type === 'text'
        ? response.content[0].text
        : 'No response from Claude received.';
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error in Claude API:', error);
    const errorMessage =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'Failed to get response from Claude';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
