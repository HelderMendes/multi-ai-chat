import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'gpt-4o-mini' } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model,
      max_tokens: 1000,
      temperature: 0.7,
    });
    const text =
      completion.choices[0]?.message?.content ||
      'No response from ChatGPT received.';
    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    console.error('Error in ChatGPT API:', error);
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Internal Server Error – Undefined error';
    return NextResponse.json(
      { error: errorMessage || 'Failed to get response from ChatGPT' },
      { status: 500 }
    );
  }
}
