// app/api/chat/route.ts
import { NextResponse } from 'next/server';

type ReqBody = {
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    const userMessage = body.message ?? '';

    if (!userMessage || userMessage.trim().length === 0) {
      return NextResponse.json({ reply: 'الرسالة فارغة.' }, { status: 400 });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return NextResponse.json({ reply: 'مفتاح OpenAI غير مُهيأ على الخادم.' }, { status: 500 });
    }

    // system prompt to make the assistant act as "دليلة" and focus on Saudi heritage in Arabic
    const systemPrompt = `
You are "دليلة", a friendly Arabic assistant specialized in Saudi cultural heritage.
Answer in Arabic. Use clear short paragraphs and emojis where appropriate. 
Focus on the five regions (northern, central, southern, western, eastern). 
If the user asks about a region, include: short description, 2-4 heritage sites, a few traditional arts, and typical foods.
If unsure, politely ask a clarifying question.
Keep replies concise and user-friendly.
`;

    const payload = {
      model: 'gpt-4o-mini', // يمكن تغييره حسب توافر حسابك
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 800
    };

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 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`
      },
      body: JSON.stringify(payload)
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI error:', openaiRes.status, errText);
      return NextResponse.json({ reply: 'فشل في الاتصال بخدمة الذكاء الاصطناعي.' }, { status: 502 });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? 'عذراً، لم أتلقَ ردًّا واضحاً.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ reply: 'حدث خطأ في الخادم. حاول مرة أخرى.' }, { status: 500 });
  }
}
