"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Star,
  MessageCircle,
  Building2,
  FileText,
  Store,
  Clock,
  Send,
  Mic,
  ChevronRight,
  Lightbulb,
  BarChart3,
  Bell,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { LanguagePill } from "@/components/LanguagePill";
import { cn } from "@/lib/utils";

const modules = [
  {
    title: "Business Advisor",
    desc: "Get expert AI guidance for your shop",
    href: "/advisor",
    icon: MessageCircle,
    iconPath: "/Business advisor home.svg",
    color: "text-teal-primary bg-teal-primary/10",
    border: "border-teal-primary/20",
    useImage: true,
  },
  {
    title: "Government Schemes",
    desc: "Discover MSME schemes & subsidies",
    href: "/schemes",
    icon: Building2,
    iconPath: "/Government Scheme home.svg",
    color: "text-blue-600 bg-blue-50",
    border: "border-blue-100",
    useImage: true,
  },
  {
    title: "Create Documents",
    desc: "Generate policies & legal docs",
    href: "/documents",
    icon: FileText,
    iconPath: "/Create Document home.svg",
    color: "text-purple-600 bg-purple-50",
    border: "border-purple-100",
    useImage: true,
  },
  {
    title: "My Business",
    desc: "Manage your business profile",
    href: "/business",
    icon: Store,
    iconPath: "/My Business icon - home.svg",
    color: "text-orange-600 bg-orange-50",
    border: "border-orange-100",
    useImage: true,
  },
];

const chips = [
  "How can I increase sales?",
  "Find government schemes",
  "Create a return policy",
];

const recommendations = [
  {
    title: "Create a customer return policy",
    tag: "Policy template",
    icon: Lightbulb,
    href: "/documents",
  },
  {
    title: "Explore MSME schemes in Tamil Nadu",
    tag: "2 schemes may suit you",
    icon: Building2,
    href: "/schemes",
  },
  {
    title: "Tips to increase festival season sales",
    tag: "Growth idea",
    icon: BarChart3,
    href: "/advisor",
  },
];

const activities = [
  { title: "Employee Attendance Policy", type: "document", time: "2 hours ago", status: "Draft" },
  { title: "Business Advisor Chat", type: "chat", time: "5 hours ago", status: "" },
  { title: "PMEGP Scheme viewed", type: "scheme", time: "Yesterday", status: "" },
];

const NAV_TABS = [
  { href: "/home", icon: Store, label: "Home" },
  { href: "/advisor", icon: MessageCircle, label: "Advisor" },
  { href: "/schemes", icon: Building2, label: "Schemes" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/business", icon: Store, label: "My Business" },
];

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<"en" | "ta">("en");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/advisor?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="max-w-md mx-auto bg-white h-screen shadow-xl relative flex flex-col text-slate-main">
      {/* Header */}
      <header className="flex items-center justify-between gap-2 md:gap-4 px-4 py-3.5 border-b border-slate-200 bg-white z-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Logo width={26} className="flex-shrink-0" />
        </div>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <LanguagePill lang={lang} onChange={setLang} className="flex-shrink-0" />
          <div className="relative ml-1 md:ml-2">
            <button
              className="relative p-1.5 rounded-full text-slate-muted hover:text-teal-primary transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-red-500 border border-white" />
              </span>
            </button>
          </div>
          <div className="relative ml-1 md:ml-3">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-main text-sm font-medium hover:bg-slate-50 transition-colors"
              aria-label="Profile"
            >
              <span className="h-7 w-7 rounded-full bg-teal-primary flex items-center justify-center text-white text-[10px] font-bold">
                MA
              </span>
              <ChevronDown className="w-3 h-3 text-slate-muted" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 py-4 sm:py-4 space-y-4 sm:space-y-6">
        {/* Welcome & Profile Banner */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-teal-primary text-sm font-medium">Good morning, Mohamed!</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e6fffa] text-teal-primary font-bold text-lg shadow-sm">
                <Image
                  src="/images/business-assistant-illustration.png"
                  alt="Shop illustration"
                  width={48}
                  height={48}
                  className="max-w-full h-auto object-contain"
                  priority
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-main">AFIYA Bags</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-primary/10 text-teal-primary font-bold">
                    {">"}
                  </span>
                </div>
                <p className="text-xs text-slate-muted mt-0.5">
                  Tiruchirappalli, Tamil Nadu
                </p>
                <p className="text-xs text-slate-muted">
                  <span className="font-semibold">Retail Shop</span>
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </section>

        {/* AI Copilot Search Bar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-teal-primary" />
              <h3 className="text-sm font-semibold text-slate-main">Ask your Business Copilot</h3>
            </div>
            <LanguagePill lang={lang} onChange={setLang} className="flex-shrink-0" />
          </div>
          <form onSubmit={handleSearch} className="flex items-end gap-2 mb-4 sm:mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type your business question..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc]/50 text-sm text-slate-main outline-none focus:ring-2 focus:ring-teal-primary/50 placeholder:text-slate-400"
            />
            <button
              type="button"
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-muted hover:bg-slate-50 transition-colors"
              aria-label="Microphone"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-teal-primary text-white text-sm font-semibold shadow-lg shadow-teal-primary/25 hover:bg-teal-primary-hover transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-muted text-sm font-medium hover:bg-slate-50 hover:text-slate-main transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* 4 Main Action Cards */}
        <section>
          <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-4 sm:mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.title}
                  href={m.href}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border p-4 bg-white transition-all hover:shadow-md hover:border-slate-300",
                    m.border,
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg {m.color}">
                    {m.useImage ? (
                      <div className="w-6 h-6 flex items-center justify-center">
                        <Image
                          src={m.iconPath}
                          alt={m.title}
                          width={24}
                          height={24}
                          className="w-full h-full object-contain"
                          priority
                        />
                      </div>
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-main">{m.title}</h4>
                  <p className="text-xs text-slate-muted leading-snug">{m.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recommended for you Horizontal Carousel */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Recommended For You
            </h3>
            <button className="text-xs text-teal-primary font-semibold hover:underline">
              View all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recommendations.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={r.title}
                  href={r.href}
                  className="flex-none w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-primary/10 text-teal-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-main leading-snug">{r.title}</p>
                  <span className="text-xs text-slate-muted">{r.tag}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
            Recent Activity
          </h3>
          <div className="space-y-2">
            {activities.map((a) => {
              const Icon =
                a.type === "document" ? FileText : a.type === "chat" ? MessageCircle : Building2;
              return (
                <div
                  key={a.title}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-muted">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-main truncate">{a.title}</p>
                    <div className="flex items-center gap-1.5">
                      {a.status && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] border border-teal-primary/20 text-teal-primary font-medium">
                          {a.status}
                        </span>
                      )}
                      <span className="text-xs text-slate-muted">{a.time}</span>
                    </div>
                  </div>
                  <Clock className="w-3 h-3 text-slate-300" />
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 5-Tab Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-md"
      >
        <div className="flex max-w-md mx-auto">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 px-2 py-2.5 text-xs transition-colors"
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    active ? "text-teal-primary" : "text-slate-muted",
                  )}
                />
                <span
                  className={cn(
                    "leading-none",
                    active ? "font-semibold text-teal-primary" : "font-medium text-slate-muted",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
