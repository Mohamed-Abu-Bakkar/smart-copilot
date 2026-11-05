import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";

const catalogue = [
  { name: "PMEGP", type: "Subsidy / credit-linked support", url: "https://www.kviconline.gov.in/pmegpeportal/", scope: "New micro-enterprise project information; check current project and applicant criteria with KVIC." },
  { name: "Pradhan Mantri MUDRA Yojana", type: "Micro-enterprise credit", url: "https://www.mudra.org.in/", scope: "Micro-enterprise credit information; lending decisions and terms belong to the lender." },
  { name: "CGTMSE", type: "Credit guarantee", url: "https://www.cgtmse.in/", scope: "Credit guarantee information for eligible lending to micro and small enterprises." },
  { name: "Udyam Registration", type: "MSME registration", url: "https://udyamregistration.gov.in/", scope: "Official MSME registration portal and classification information." },
  { name: "Tamil Nadu MSME Department", type: "State schemes and incentives", url: "https://msmeonline.tn.gov.in/", scope: "Tamil Nadu state department information; scheme conditions and current windows must be verified." },
  { name: "myScheme", type: "Government scheme discovery", url: "https://www.myscheme.gov.in/", scope: "Government scheme discovery portal; verify each scheme on its issuing department website." },
];

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI scheme matching is not configured. Add GROQ_API_KEY." }, { status: 503 });
  try {
    const body = await request.json();
    const profile = body.profile;
    if (!profile || typeof profile !== "object" || !profile.businessName || !profile.category) {
      return NextResponse.json({ error: "Complete your business name and business type in My Business first." }, { status: 400 });
    }
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b", temperature: 0.1, max_tokens: 1000, reasoning_effort: "medium",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a cautious Indian MSME scheme discovery assistant. Use ONLY this curated catalogue: " + JSON.stringify(catalogue) + ". Return JSON {intro:string, matches:[{name:string, relevance:\"Potential fit\"|\"Worth checking\"|\"Low apparent fit\", reason:string, questions:string[]}]}. Include only catalogue entries that plausibly relate to the supplied profile. Explain the profile facts behind each match. Never claim eligibility, approval, grant amount, current availability or application status. Where a rule is unknown, say it must be verified on the official portal. Ask only scheme-specific missing questions; do not ask for details already present in the profile. Maximum 5 matches. If none clearly match, return up to 3 Worth checking discovery portals." },
          { role: "user", content: JSON.stringify({ businessProfile: profile }) }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "Scheme matching failed." }, { status: response.status });
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    const allowed = new Map(catalogue.map(item => [item.name, item]));
    const matches = Array.isArray(parsed.matches) ? parsed.matches.filter((item: { name?: string }) => allowed.has(item.name || "")).slice(0, 5).map((item: { name: string; relevance?: string; reason?: string; questions?: string[] }) => ({
      ...item, url: allowed.get(item.name)!.url, type: allowed.get(item.name)!.type,
      relevance: ["Potential fit", "Worth checking", "Low apparent fit"].includes(item.relevance || "") ? item.relevance : "Worth checking",
      questions: Array.isArray(item.questions) ? item.questions.slice(0, 3).map(String) : []
    })) : [];
    return NextResponse.json({ intro: String(parsed.intro || "These are discovery suggestions based on the details in your saved business profile."), matches });
  } catch {
    return NextResponse.json({ error: "Unable to prepare scheme suggestions. Please try again." }, { status: 500 });
  }
}
