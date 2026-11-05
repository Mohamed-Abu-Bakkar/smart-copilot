"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Check, ChevronRight, LoaderCircle, Send, Sparkles, Store, Factory, Handshake, MoreHorizontal, UserRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BusinessProfile, useDemoWorkspace } from "@/lib/demo-workspace";

type ChatMessage = { role: "assistant" | "user"; content: string };
type Step = { key: string; phase: string; question: string; hint: string; placeholder: string; suggestions?: string[]; optional?: boolean };
const steps: Step[] = [
  { key: "businessName", phase: "Profile", question: "I'm your Business Copilot. Let's set up your business profile. First, what's the name of your business?", hint: "Your shop, brand or registered business name.", placeholder: "Type your business name..." },
  { key: "category", phase: "Profile", question: "Nice! What type of business do you run?", hint: "Choose the closest match. You can explain more in your reply.", placeholder: "Or type another business type...", suggestions: ["Retail Shop", "Manufacturing", "Service Business", "Other"] },
  { key: "industry", phase: "Details", question: "Which industry or sector best describes your business?", hint: "For example, fashion, food, beauty, construction or technology.", placeholder: "e.g. Fashion and accessories", optional: true },
  { key: "location", phase: "Details", question: "Where is your business based?", hint: "City and state are enough. This helps tailor local guidance and scheme discovery.", placeholder: "e.g. Madurai, Tamil Nadu" },
  { key: "products", phase: "Details", question: "What products do you sell or services do you provide?", hint: "You can mention multiple items, separated by commas.", placeholder: "e.g. handbags, wallets, travel bags" },
  { key: "stage", phase: "Operations", question: "How would you describe your business today?", hint: "Pick the stage that feels closest.", placeholder: "Choose your business stage", suggestions: ["Just starting", "Early stage", "Established", "Expanding"] },
  { key: "storeType", phase: "Operations", question: "How do customers buy from you?", hint: "Select one or describe a different sales channel.", placeholder: "Choose your sales channel", suggestions: ["Physical store", "Online", "Both online and physical"] },
  { key: "employees", phase: "Operations", question: "How many people currently work in the business, including you?", hint: "A rough number is fine. You can skip if you're not sure.", placeholder: "e.g. 3", optional: true },
  { key: "budget", phase: "Operations", question: "Do you have an approximate investment or growth budget in mind?", hint: "This is optional. A range is enough; don't share sensitive financial details.", placeholder: "e.g. Under ₹2 lakh", optional: true },
  { key: "registrations", phase: "Operations", question: "Does your business have any registrations or licences?", hint: "For example GST, Udyam, FSSAI or a local trade licence. Only list what you actually have.", placeholder: "e.g. GST, Udyam (or type Skip)", optional: true },
  { key: "goals", phase: "Goals", question: "What would you most like to achieve in the next 6–12 months?", hint: "Pick one or more goals, or tell me in your own words.", placeholder: "Describe your business goal...", suggestions: ["Increase sales", "Find government schemes", "Hire employees", "Expand online", "Improve operations", "Access funding"], optional: true },
];

const phaseNames = ["Profile", "Details", "Operations", "Goals", "Complete"];
const categoryOptions = [
  { label: "Retail Shop", icon: Store, desc: "Shop, store or reselling" },
  { label: "Manufacturing", icon: Factory, desc: "Making or processing goods" },
  { label: "Service Business", icon: Handshake, desc: "Services or professional work" },
  { label: "Other", icon: MoreHorizontal, desc: "Something else" },
];

export default function ProfileBuilderPage() {
  const router = useRouter();
  const { setProfile, ready } = useDemoWorkspace();
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: steps[0].question }]);
  const [draft, setDraft] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [review, setReview] = useState<BusinessProfile | null>(null);
  const [summary, setSummary] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"English" | "தமிழ்">("English");

  const current = steps[stepIndex];
  const phaseIndex = useMemo(() => {
    if (review) return 4;
    return phaseNames.indexOf(current?.phase ?? "Complete");
  }, [current, review]);

  function addAnswer(answer: string) {
    const clean = answer.trim();
    if (!clean || busy || !current) return;
    const nextAnswers = { ...answers, [current.key]: clean };
    setAnswers(nextAnswers);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: clean }];
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      nextMessages.push({ role: "assistant", content: steps[nextIndex].question });
      setMessages(nextMessages);
      setStepIndex(nextIndex);
      setDraft("");
      setError("");
      return;
    }
    nextMessages.push({ role: "assistant", content: "Thanks! I'm organizing what you've shared into a business profile. I'll show you the details for review before saving." });
    setMessages(nextMessages);
    setDraft("");
    void prepareReview(nextMessages);
  }

  async function prepareReview(transcript: ChatMessage[]) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/profile/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Couldn't prepare your profile.");
      setReview(data.profile as BusinessProfile);
      setSummary(data.summary || "");
      setMissing(data.missing || []);
      setMessages(items => [...items, { role: "assistant", content: "Here's the profile I understood from our conversation. Please review it and correct anything before I save it." }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to prepare your profile.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile() {
    if (!review?.businessName.trim() || !review.category.trim()) {
      setError("Please add your business name and business type before saving.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await setProfile({
        ...review,
        businessName: review.businessName.trim(),
        category: review.category.trim(),
        products: review.products.filter(Boolean),
        registrations: review.registrations.filter(Boolean),
        goals: review.goals ?? [],
      });
      router.push("/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save your profile. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function updateReview<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setReview(current => current ? { ...current, [key]: value } : current);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    addAnswer(draft);
  }

  function skip() {
    if (current?.optional) addAnswer("Not provided");
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button onClick={() => router.push("/")} aria-label="Back" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><ArrowLeft className="h-5 w-5"/></button>
          <Logo width={30}/>
          <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
            {(["English", "தமிழ்"] as const).map(lang => <button key={lang} onClick={() => setLanguage(lang)} className={`rounded-full px-2.5 py-1.5 ${language === lang ? "bg-white font-semibold text-teal-800 shadow-sm" : "text-slate-500"}`}>{lang}</button>)}
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-58px)] max-w-2xl flex-col px-3 pb-4">
        <section className="px-2 pb-4 pt-5">
          <div className="flex items-center justify-between">
            {phaseNames.map((phase, index) => <div key={phase} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${index <= phaseIndex ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-400"}`}>{index < phaseIndex ? <Check className="h-3.5 w-3.5"/> : index + 1}</div>
              <span className={`text-[10px] ${index === phaseIndex ? "font-semibold text-teal-800" : "text-slate-400"}`}>{phase}</span>
            </div>)}
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: review ? "100%" : `${(stepIndex / steps.length) * 100}%` }}/></div>
        </section>

        <section className="flex-1 space-y-4 pb-4">
          {messages.map((message, index) => <div key={index} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && <Image src="/images/chatbot-profile-logo.png" alt="Smart Copilot assistant" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full border border-teal-100 object-cover scale-125" />}
            <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${message.role === "user" ? "rounded-br-md bg-[#d9f8ef] text-slate-800" : "rounded-bl-md border border-slate-100 bg-white text-slate-700"}`}>{message.content}</div>
            {message.role === "user" && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"><UserRound className="h-4 w-4"/></div>}
          </div>)}
          {busy && <div className="ml-11 flex items-center gap-2 text-xs text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin"/>Preparing your business profile...</div>}

          {!review && current && current.key === "category" && <div className="grid grid-cols-2 gap-2 pl-11 sm:grid-cols-4">
            {categoryOptions.map(option => { const Icon = option.icon; return <button key={option.label} onClick={() => addAnswer(option.label)} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:border-teal-500 hover:bg-teal-50"><Icon className="h-6 w-6 text-slate-700"/><span className="text-xs font-semibold">{option.label}</span><span className="text-[10px] text-slate-400">{option.desc}</span></button>; })}
          </div>}

          {!review && current?.suggestions && current.key !== "category" && <div className="flex flex-wrap gap-2 pl-11">
            {current.suggestions.map(option => <button key={option} onClick={() => addAnswer(option)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-teal-500 hover:bg-teal-50">{option}</button>)}
          </div>}

          {review && <div className="ml-11 space-y-3 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-700"/><h2 className="text-sm font-bold">Your proposed business profile</h2></div>
            {summary && <p className="rounded-xl bg-teal-50 p-3 text-xs leading-relaxed text-teal-900">{summary}</p>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-[11px] font-semibold text-slate-500">Business name<input value={review.businessName} onChange={e=>updateReview("businessName",e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500">Business type<input value={review.category} onChange={e=>updateReview("category",e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500">Industry<input value={review.industry} onChange={e=>updateReview("industry",e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500">Location<input value={review.location} onChange={e=>updateReview("location",e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500 sm:col-span-2">Products or services<input value={review.products.join(", ")} onChange={e=>updateReview("products",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500">Business stage<select value={review.stage} onChange={e=>updateReview("stage",e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-normal text-slate-800"><option>Starting</option><option>Early stage</option><option>Established</option><option>Expanding</option></select></label>
              <label className="text-[11px] font-semibold text-slate-500">Sales channel<select value={review.storeType} onChange={e=>updateReview("storeType",e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-normal text-slate-800"><option>Physical</option><option>Online</option><option>Both</option></select></label>
              <label className="text-[11px] font-semibold text-slate-500">Employees<input type="number" min="0" value={review.employeeCount ?? ""} onChange={e=>updateReview("employeeCount",e.target.value===""?undefined:Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500">Investment budget<input value={review.investmentBudget ?? ""} onChange={e=>updateReview("investmentBudget",e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500 sm:col-span-2">Registrations and licences<input value={review.registrations.join(", ")} onChange={e=>updateReview("registrations",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
              <label className="text-[11px] font-semibold text-slate-500 sm:col-span-2">Business goals<input value={(review.goals ?? []).join(", ")} onChange={e=>updateReview("goals",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal text-slate-800"/></label>
            </div>
            {missing.length > 0 && <p className="text-[11px] text-amber-700">Still missing (optional): {missing.join(", ")}</p>}
            <button disabled={!ready || busy} onClick={() => void saveProfile()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 p-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving profile..." : "Confirm and save profile"} <Check className="h-4 w-4"/></button>
            <button onClick={()=>{setReview(null);setStepIndex(steps.length-1);setMessages(items=>[...items,{role:"assistant",content:"Tell me what you'd like to correct, or choose a suggested goal below."}]);}} className="w-full text-xs font-medium text-teal-700 underline">Continue chatting instead</button>
          </div>}
        </section>

        {error && <p className="mb-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        {!review && current && <div className="sticky bottom-0 border-t border-slate-100 bg-[#f7f9fc] pb-2 pt-3">
          <p className="mb-2 pl-1 text-[10px] text-slate-400">{current.hint}</p>
          <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
            <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder={current.placeholder} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
            {current.optional && <button type="button" onClick={skip} className="px-2 text-[11px] font-medium text-slate-400">Skip</button>}
            <button disabled={!draft.trim() || busy} aria-label="Send reply" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white disabled:opacity-40"><Send className="h-4 w-4"/></button>
          </form>
        </div>}
        <p className="pt-2 text-center text-[10px] text-slate-400">Your answers are used to propose a profile. You can review and edit every field before it is saved.</p>
      </main>
    </div>
  );
}
