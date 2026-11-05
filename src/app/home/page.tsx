"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  MessageCircle, Building2, FileText, Store, Clock, Send, ChevronRight,
  Lightbulb, BarChart3, ArrowUpRight, Plus, Sparkles,
} from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useDemoWorkspace } from "@/lib/demo-workspace";

const modules = [
  { title: "Business Advisor", desc: "Get practical guidance for your business", href: "/advisor", icon: MessageCircle, color: "text-teal-primary bg-teal-primary/10", border: "border-teal-primary/20" },
  { title: "Government Schemes", desc: "Explore MSME programmes and support", href: "/schemes", icon: Building2, color: "text-blue-600 bg-blue-50", border: "border-blue-100" },
  { title: "Create Documents", desc: "Draft policies and business documents", href: "/documents", icon: FileText, color: "text-purple-600 bg-purple-50", border: "border-purple-100" },
  { title: "My Business", desc: "Update your shared business profile", href: "/business", icon: Store, color: "text-orange-600 bg-orange-50", border: "border-orange-100" },
];

const prompts = [
  { title: "Plan how to increase sales", tag: "Growth", icon: Lightbulb },
  { title: "Review my business operations", tag: "Operations", icon: BarChart3 },
  { title: "Explore relevant MSME support", tag: "Schemes", icon: Building2 },
];

const NAV_TABS = [
  { href: "/home", icon: Store, label: "Home" },
  { href: "/advisor", icon: MessageCircle, label: "Advisor" },
  { href: "/schemes", icon: Building2, label: "Schemes" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/business", icon: Store, label: "My Business" },
];

function relativeTime(timestamp: number) {
  const elapsed = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return minutes + " min ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + " hr ago";
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : days + " days ago";
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, documents, messages, ready } = useDemoWorkspace();
  const [searchQuery, setSearchQuery] = useState("");

  const activities = useMemo(() => {
    const items = documents.map(document => ({
      id: "doc-" + document.id,
      title: document.title,
      type: "document" as const,
      time: document.updatedAt,
      status: "Saved draft",
      href: "/documents",
    }));
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) items.push({
      id: "advisor-" + lastMessage.createdAt,
      title: "Business Advisor conversation",
      type: "chat" as const,
      time: lastMessage.createdAt ?? Date.now(),
      status: lastMessage.role === "user" ? "Question sent" : "Response received",
      href: "/advisor",
    });
    return items.sort((a, b) => b.time - a.time).slice(0, 4);
  }, [documents, messages]);

  const askAdvisor = (value: string) => {
    const prompt = value.trim();
    if (prompt) router.push("/advisor?prompt=" + encodeURIComponent(prompt));
  };

  const greeting = profile?.businessName
    ? "Let's make progress with " + profile.businessName + "."
    : "Your business workspace starts here.";

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative flex flex-col text-slate-main">
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-white">
        <Logo width={26} />
        <Link href="/business" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          My workspace <ArrowUpRight className="inline h-3 w-3 ml-1" />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 py-4 space-y-5">
        <section className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-primary">Smart Copilot</p>
            <h1 className="mt-1 text-xl font-bold">{ready ? greeting : "Loading your workspace…"}</h1>
            <p className="mt-1 text-sm text-slate-muted">Your business information is shared across the tools below.</p>
          </div>

          <Link href="/business" className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-primary/40">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e6fffa]">
                <Image src="/images/business-assistant-illustration.png" alt="Business workspace illustration" width={48} height={48} className="h-12 w-12 object-contain" priority />
              </div>
              <div className="min-w-0 flex-1">
                {profile ? <>
                  <p className="truncate text-sm font-semibold">{profile.businessName}</p>
                  <p className="mt-0.5 text-xs text-slate-muted">{[profile.category, profile.location].filter(Boolean).join(" · ") || "Business profile saved"}</p>
                  <p className="mt-1 text-xs text-teal-primary">View or update business profile</p>
                </> : <>
                  <p className="text-sm font-semibold">Set up your business profile</p>
                  <p className="mt-0.5 text-xs text-slate-muted">Add your details once to personalize advice, scheme discovery and documents.</p>
                  <p className="mt-1 text-xs font-semibold text-teal-primary">Create profile <ChevronRight className="inline h-3 w-3" /></p>
                </>}
              </div>
            </div>
          </Link>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-primary" />
            <h2 className="text-sm font-semibold">Ask your Business Copilot</h2>
          </div>
          <form onSubmit={e => { e.preventDefault(); askAdvisor(searchQuery); }} className="flex items-center gap-2">
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Type your business question…" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-primary/30" />
            <button type="submit" disabled={!searchQuery.trim()} className="rounded-xl bg-teal-primary p-3 text-white disabled:opacity-50" aria-label="Ask advisor"><Send className="h-4 w-4" /></button>
          </form>
          <div className="flex flex-wrap gap-2">
            {["How can I increase sales?", "Help me manage cash flow", "What should I work on next?"].map(prompt =>
              <button key={prompt} onClick={() => askAdvisor(prompt)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-teal-primary hover:bg-teal-primary/5">{prompt}</button>
            )}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Your tools</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {modules.map(module => {
              const Icon = module.icon;
              return <Link key={module.title} href={module.href} className={cn("flex flex-col gap-2 rounded-xl border bg-white p-4 transition-all hover:shadow-sm", module.border)}>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", module.color)}><Icon className="h-5 w-5" /></div>
                <h3 className="text-sm font-semibold">{module.title}</h3>
                <p className="text-xs leading-snug text-slate-muted">{module.desc}</p>
              </Link>;
            })}
          </div>
        </section>

        {profile && <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Suggested next steps</h2>
          <div className="space-y-2">
            {prompts.map(item => {
              const Icon = item.icon;
              return <button key={item.title} onClick={() => askAdvisor(item.title)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-teal-primary/40">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-primary/10 text-teal-primary"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.title}</span><span className="text-xs text-slate-muted">{item.tag}</span></span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>;
            })}
          </div>
        </section>}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Recent activity</h2>
            <Link href="/documents" className="text-xs font-semibold text-teal-primary">Documents</Link>
          </div>
          {!ready ? <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-muted">Loading activity…</p> : activities.length ? <div className="space-y-2">
            {activities.map(activity => {
              const Icon = activity.type === "document" ? FileText : MessageCircle;
              return <Link key={activity.id} href={activity.href} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 hover:bg-slate-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-muted"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{activity.title}</span><span className="text-xs text-slate-muted">{activity.status} · {relativeTime(activity.time)}</span></span>
                <Clock className="h-3.5 w-3.5 text-slate-300" />
              </Link>;
            })}
          </div> : <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center">
            <p className="text-sm font-medium">No activity yet</p>
            <p className="mt-1 text-xs text-slate-muted">Your saved drafts and advisor conversations will appear here.</p>
            <Link href="/documents" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-primary"><Plus className="h-3.5 w-3.5" /> Create your first document</Link>
          </div>}
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-md">
          {NAV_TABS.map(tab => {
            const Icon = tab.icon;
            const active = pathname === tab.href;
            return <Link key={tab.href} href={tab.href} className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-2.5 text-xs">
              <Icon className={cn("h-5 w-5", active ? "text-teal-primary" : "text-slate-muted")} />
              <span className={cn("leading-none", active ? "font-semibold text-teal-primary" : "font-medium text-slate-muted")}>{tab.label}</span>
            </Link>;
          })}
        </div>
      </nav>
    </div>
  );
}
