import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: "### 📌 Mock Mode\nAapne pucha: **'" + prompt + "'**\n\n* **Status:** Please add a valid `GEMINI_API_KEY` in your `.env.local` file for live organized AI answers." 
      });
    }

    // Valid and stable Gemini models ordered by performance & speed
    const models = ["gemini-3.8-flash","gemini-3.8-flash-tts", "gemini-3.5-flash-lite", "gemini-4-argon"];
    let aiText = null;
    let lastError = "";

    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { 
                      text: `You are an expert AI tutor for GATE and UGC NET Computer Science aspirants. Answer the following doubt in a clean, highly organized, structured format using Markdown (use bold headings, bullet points, and code blocks where necessary) in Hinglish/English. Question: ${prompt}` 
                    }
                  ]
                }
              ],
            }),
          }
        );

        const data = await geminiRes.json();

        if (geminiRes.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiText = data.candidates[0].content.parts[0].text;
          break; // Success! Exit loop
        } else {
          lastError = data.error?.message || "Unknown error";
        }
      } catch (err: any) {
        lastError = err.message || "Network error";
      }
    }

    if (!aiText) {
      // Fallback graceful response if all models fail
      return NextResponse.json({ 
        reply: `### ⚠️ Notice\nServer is currently experiencing high demand (${lastError}). Please try asking your doubt again in a few seconds!` 
      });
    }

    return NextResponse.json({ reply: aiText });

  } catch (error) {
    console.error("Server Exception:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}