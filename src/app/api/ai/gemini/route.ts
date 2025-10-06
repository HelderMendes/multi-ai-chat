import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'gemini-1.5-flash' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const geminiModel = genAI.getGenerativeModel({ model });
    const result = await geminiModel.generateContent(message);
    const response = await result.response;
    const text = response.text() || 'No response from Gemini received.';

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    const errorMessage =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'Failed to get response from Gemini API';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
