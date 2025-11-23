import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("hiii")
  try {
    const { userMessage, systemPrompt } = await req.json();
    console.log("hi")
    console.log(process.env.OPENAI_API_KEY)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 1000,
      })
    });

    const data = await response.json();
    console.log(data)
    return NextResponse.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
