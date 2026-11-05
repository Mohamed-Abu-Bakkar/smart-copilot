import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";

type Turn = { role?: string; content?: string };
type ExtractedProfile = {
  businessName?: unknown; category?: unknown; industry?: unknown; location?: unknown;
  stage?: unknown; storeType?: unknown; products?: unknown; employeeCount?: unknown;
  investmentBudget?: unknown; registrations?: unknown; goals?: unknown;
  summary?: unknown; missing?: unknown;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseJsonObject(raw: string): ExtractedProfile {
  const cleaned = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(cleaned) as ExtractedProfile; } catch { /* try to recover a JSON object from surrounding model text */ }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as ExtractedProfile;
  throw new Error("The AI response was not valid JSON. Please try again.");
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Add GROQ_API_KEY to .env.local to create the AI profile summary." }, { status: 503 });

  try {
    const body = await request.json();
    const transcript: Turn[] = Array.isArray(body.transcript) ? body.transcript : [];
    const userAnswers = transcript
      .map((turn, index) => ({ turn, index }))
      .filter(({ turn }) => turn.role === "user" && asText(turn.content))
      .map(({ turn, index }) => ({
        question: [...transcript.slice(0, index)].reverse().find(item => item.role === "assistant")?.content || "Business detail",
        answer: asText(turn.content),
      }));

    if (!userAnswers.length) {
      return NextResponse.json({ error: "Please answer at least one profile question." }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature: 0.1,
        max_tokens: 1400,
        reasoning_effort: "medium",
        messages: [
          {
            role: "system",
            content: [
              "You extract structured facts for a small-business profile from question-and-answer pairs.",
              "Return exactly one valid JSON object. Do not use markdown fences, comments, or text before or after the JSON.",
              "Required keys and types: businessName string, category string, industry string, location string, stage string, storeType string, products array of strings, employeeCount number or null, investmentBudget string, registrations array of strings, goals array of strings, summary string, missing array of strings.",
              "Use only facts explicitly provided by the business owner. Assistant questions are context, not facts. Never invent unknown details.",
              "Use empty strings and empty arrays for unknown values; employeeCount must be null if unknown.",
              "Normalize obvious spelling mistakes in common business terms without changing meaning. For example, 'udhayam registerd' means 'Udyam registration' when the context clearly refers to MSME registration.",
              "Map business stage to Starting, Early stage, Established, or Expanding when the answer supports one.",
              "Map sales channel to Physical, Online, or Both. If the answer is unclear, use an empty string.",
              "Keep the summary concise. The missing array should contain only useful unanswered profile fields, not information already answered."
            ].join(" ")
          },
          { role: "user", content: JSON.stringify({ answers: userAnswers }) }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const providerMessage = data?.error?.message || "AI profile extraction failed.";
      return NextResponse.json({ error: providerMessage }, { status: response.status });
    }

    const raw = data.choices?.[0]?.message?.content;
    if (typeof raw !== "string" || !raw.trim()) {
      return NextResponse.json({ error: "The AI returned an empty profile. Please try again." }, { status: 502 });
    }

    const parsed = parseJsonObject(raw);
    const stageText = asText(parsed.stage);
    const storeText = asText(parsed.storeType);
    const employeeCount = typeof parsed.employeeCount === "number" && Number.isFinite(parsed.employeeCount) && parsed.employeeCount >= 0
      ? parsed.employeeCount : undefined;

    const profile = {
      businessName: asText(parsed.businessName),
      category: asText(parsed.category),
      industry: asText(parsed.industry),
      location: asText(parsed.location),
      stage: /expand/i.test(stageText) ? "Expanding" : /establish/i.test(stageText) ? "Established" : /early/i.test(stageText) ? "Early stage" : /start/i.test(stageText) ? "Starting" : "",
      storeType: /both/i.test(storeText) ? "Both" : /online|e-?commerce/i.test(storeText) ? "Online" : /physical|offline|store/i.test(storeText) ? "Physical" : "",
      products: Array.isArray(parsed.products) ? parsed.products.map(asText).filter(Boolean) : [],
      employeeCount,
      investmentBudget: asText(parsed.investmentBudget),
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations.map(asText).filter(Boolean) : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals.map(asText).filter(Boolean) : [],
    };

    if (!profile.businessName || !profile.category) {
      return NextResponse.json({
        profile,
        summary: asText(parsed.summary),
        missing: Array.isArray(parsed.missing) ? parsed.missing.map(asText) : ["businessName", "category"],
        warning: "Please confirm the business name and business type before saving."
      });
    }

    return NextResponse.json({
      profile,
      summary: asText(parsed.summary),
      missing: Array.isArray(parsed.missing) ? parsed.missing.map(asText) : []
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to prepare your profile. Please try again."
    }, { status: 500 });
  }
}
