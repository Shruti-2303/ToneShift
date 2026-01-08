import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, tone } = await request.json();

    if (!message || !tone) {
      return NextResponse.json(
        { error: 'Message and tone are required' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message exceeds 2000 characters' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Rewrite the following message in a ${tone} tone.
Maintain similar length, meaning, and clarity.
Output only the rewritten message as a single string.

Message: "${message}"`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 12000)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof model.generateContent>>;

    const response = result.response;
    const text = response.text();

    return NextResponse.json({ rewrittenText: text.trim() });
  } catch (error) {
    console.error('Rewrite error:', error);

    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'Request took too long. Please try again.' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to rewrite text. Please try again.' },
      { status: 500 }
    );
  }
}
