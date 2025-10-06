import { NextRequest, NextResponse } from 'next/server';

const LLAMA_API_URL = process.env.LLAMA_API_URL || 'http://localhost:11434';

export async function POST(req: NextRequest) {
  try {
    const { message, model = 'llama3:8b' } = await req.json();

    if (!message || !model) {
      return NextResponse.json(
        { error: 'Message and model are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${LLAMA_API_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: message,
        stream: true, // streaming
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // Optionally, log this or handle as error
      throw new Error(`Non-JSON response: ${text}`);
    }

    // const data = await response.json();

    // llama's API returns text in `response` field
    return NextResponse.json({ text: data.response }, { status: 200 });
  } catch (error) {
    console.error('Error in llama API:', error);
    return NextResponse.json(
      { error: 'Failed to connect to llama' },
      { status: 500 }
    );
  }
}
