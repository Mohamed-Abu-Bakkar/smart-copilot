"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Download, Save, Sparkles } from "lucide-react";
import { useDemoWorkspace } from "@/lib/demo-workspace";

const templates = [
  { title: "Customer Return & Exchange Policy", type: "Customer policy", prompt: "Draft a customer return and exchange policy. Ask for missing return window, product condition, proof of purchase, refund method and exceptions. Use placeholders rather than inventing rules." },
  { title: "Employee Attendance Policy", type: "Employee policy", prompt: "Draft a simple employee attendance policy. Ask for working hours, weekly off, leave process, late-arrival rules and contact person. Do not invent company rules." },
  { title: "Leave Policy", type: "Employee policy", prompt: "Draft a basic employee leave policy. Ask for leave types, accrual, approval process, holidays and applicable employment context. Use placeholders for unknown rules." },
  { title: "Supplier Terms & Purchase Policy", type: "Operations", prompt: "Draft supplier and purchasing terms. Ask for payment terms, delivery, inspection, returns, quality and dispute process. Do not create binding terms without user inputs." },
  { title: "Privacy Notice", type: "Customer policy", prompt: "Draft a plain-language privacy notice for a small business. Ask what customer data is collected, why, how it is stored, shared and deleted. Flag legal review." },
  { title: "Customer Service Policy", type: "Operations", prompt: "Draft a customer service policy. Ask for service channels, response hours, complaint escalation and resolution commitments." },
];

export default function CreateDocumentPage() {
  const { profile, saveDocument } = useDemoWorkspace();
  const [template, setTemplate] = useState(templates[0]);
  const [answers, setAnswers] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function generate() {
    setLoading(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        message: `Create an editable first draft for: ${template.title}. Instructions: ${template.prompt}\nUser-provided requirements: ${answers || "Not provided; use clearly marked placeholders and list questions at the top."}\nReturn a well-structured document with headings. Clearly mark all unknown business-specific terms as [TO CONFIRM]. Do not claim legal compliance.`,
        profile
      }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setContent(data.answer);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setLoading(false); }
  }

  function save() {
    if (!content.trim()) return;
    saveDocument({ title: template.title, type: template.type, content });
    setSaved(true);
  }

  function download() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${template.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  return <div className="px-4 py-4 space-y-4 text-slate-main">
    <Link href="/documents" className="inline-flex items-center gap-2 text-sm text-teal-primary"><ArrowLeft className="w-4 h-4"/> Documents</Link>
    <div><h1 className="text-xl font-bold">Document Studio</h1><p className="text-sm text-slate-muted mt-1">Create a first draft using your business context. Review every term before use.</p></div>
    {!profile && <p className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">Your business profile is blank. Add details in My Business or use placeholders in the draft.</p>}
    <section className="space-y-2"><label className="text-xs font-semibold uppercase tracking-wide text-slate-muted">Choose a document</label>
      <select value={template.title} onChange={e => setTemplate(templates.find(t => t.title === e.target.value) ?? templates[0])} className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white">{templates.map(t => <option key={t.title}>{t.title}</option>)}</select>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-muted pt-2">Your rules and requirements</label>
      <textarea value={answers} onChange={e => setAnswers(e.target.value)} rows={5} placeholder="Describe the rules you actually follow. For example: returns accepted within 7 days with receipt, unused condition..." className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-teal-primary/30"/>
      <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-primary text-white p-3 text-sm font-semibold disabled:opacity-60"><Sparkles className="w-4 h-4"/>{loading ? "Drafting..." : "Generate draft"}</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
    {content && <section className="space-y-2"><div className="flex justify-between items-center"><h2 className="font-semibold text-sm">Editable draft</h2><span className="text-xs text-slate-muted">Not legal advice</span></div>
      <textarea value={content} onChange={e => {setContent(e.target.value); setSaved(false);}} rows={20} className="w-full rounded-xl border border-slate-200 p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-teal-primary/30"/>
      <div className="grid grid-cols-2 gap-2"><button onClick={save} className="rounded-xl bg-teal-primary text-white p-3 text-sm font-semibold flex items-center justify-center gap-2"><Save className="w-4 h-4"/>Save draft</button><button onClick={download} className="rounded-xl border border-slate-200 p-3 text-sm font-semibold flex items-center justify-center gap-2"><Download className="w-4 h-4"/>Download .txt</button></div>
      {saved && <p className="text-xs text-green-700">Saved in this browser's demo workspace.</p>}
      <p className="text-xs text-slate-muted">Review all placeholders and obtain professional review for employment, tax, privacy or other regulated documents. Saved drafts currently live in browser storage; cloud sync and PDF/DOCX export are not yet configured.</p>
    </section>}
  </div>;
}
