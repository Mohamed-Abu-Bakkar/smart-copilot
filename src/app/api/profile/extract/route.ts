import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Add GROQ_API_KEY to .env.local to create the AI profile summary." }, { status: 503 });
  try {
    const body = await request.json();
    const transcript = Array.isArray(body.transcript) ? body.transcript : [];
    if (!transcript.some((m: { role?: string }) => m.role === "user")) {
      return NextResponse.json({ error: "Please answer at least one profile question." }, { status: 400 });
    }
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature: 0.1,
        max_tokens: 900,
        reasoning_effort: "medium",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `Extract a small-business profile from the conversation. Return ONLY a JSON object with keys: businessName (string), category (string), industry (string), location (string), stage (string), storeType (string), products (string[]), employeeCount (number or null), investmentBudget (string), registrations (string[]), goals (string[]), summary (string), missing (string[]). Only use details explicitly stated or strongly implied by the user. Never invent a name, location, registration, number, budget or policy. For unknown strings return empty string; unknown arrays return []; employeeCount unknown returns null. category should be one of Retail Shop, Manufacturing, Service Business, Other when appropriate, otherwise a concise user-grounded label. Translate conversational Tamil or other languages faithfully. Keep summary concise and list missing essentials in missing. The profile must remain honest; do not treat suggestions shown by the assistant as facts unless the user selected or confirmed them.` },
          { role: "user", content: JSON.stringify(transcript) }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "AI profile extraction failed." }, { status: response.status });
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error("The AI returned an empty profile.");
    const parsed = JSON.parse(raw);
    const profile = {
      businessName: String(parsed.businessName || "").trim(),
      category: String(parsed.category || "").trim(),
      industry: String(parsed.industry || "").trim(),
      location: String(parsed.location || "").trim(),
      stage: /expand/i.test(String(parsed.stage || "")) ? "Expanding" : /establish/i.test(String(parsed.stage || "")) ? "Established" : /early/i.test(String(parsed.stage || "")) ? "Early stage" : "Starting",
      storeType: /both|online.*physical|physical.*online/i.test(String(parsed.storeType || "")) ? "Both" : /online|e-?commerce/i.test(String(parsed.storeType || "")) ? "Online" : "Physical",
      products: Array.isArray(parsed.products) ? parsed.products.map(String).filter(Boolean) : [],
      employeeCount: Number.isFinite(parsed.employeeCount) && parsed.employeeCount >= 0 ? Number(parsed.employeeCount) : undefined,
      investmentBudget: String(parsed.investmentBudget || ""),
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations.map(String).filter(Boolean) : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals.map(String).filter(Boolean) : [],
    };
    return NextResponse.json({ profile, summary: String(parsed.summary || ""), missing: Array.isArray(parsed.missing) ? parsed.missing.map(String) : [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to prepare your profile." }, { status: 500 });
  }
}
