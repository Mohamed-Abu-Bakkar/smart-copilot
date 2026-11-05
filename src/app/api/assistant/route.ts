import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI is not configured yet. Add GROQ_API_KEY to .env.local and restart the dev server." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const profile = body.profile && typeof body.profile === "object" ? body.profile : null;
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    if (!message) return NextResponse.json({ error: "Please enter a question." }, { status: 400 });

    const profileContext = profile
      ? JSON.stringify(profile)
      : "No business profile has been provided. Ask relevant clarifying questions and avoid assuming business details.";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: 0.4,
        max_tokens: 1200,
        messages: [
          { role: "system", content: `You are Smart Copilot, a practical advisor for Indian micro and small businesses. Give clear, low-cost, actionable advice. Never invent facts about the business, government schemes, laws, eligibility, or financial outcomes. If information is missing, ask a concise follow-up. For legal, tax, or regulated topics, state that this is general information and recommend checking official sources or a qualified professional. Reply in the user's language when clear. Business profile (user-provided; may be empty): ${profileContext}` },
          ...history.filter((item: { role?: string; content?: string }) => ["user", "assistant"].includes(item.role ?? "") && typeof item.content === "string").map((item: { role: "user" | "assistant"; content: string }) => ({ role: item.role, content: item.content })),
          { role: "user", content: message }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "The AI provider could not complete the request." }, { status: response.status });
    return NextResponse.json({ answer: data.choices?.[0]?.message?.content ?? "I couldn't create a response. Please try again." });
  } catch {
    return NextResponse.json({ error: "Unable to reach the AI service. Please try again." }, { status: 500 });
  }
}
