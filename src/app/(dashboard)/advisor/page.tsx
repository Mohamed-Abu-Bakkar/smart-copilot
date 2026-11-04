"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, Bookmark, Plus, Mic, Send, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const chips = [
  "How can I increase sales?",
  "Marketing ideas for my shop",
  "Improve customer service",
  "How to manage inventory",
];

const accordions = [
  {
    id: "visibility",
    title: "Improve Store Visibility",
    icon: "🏪",
    steps: [
      "Add a clear, colorful signboard with your shop name in Tamil and English.",
      "Display your best-selling products near the entrance to attract footfall.",
      "Register your business on Google Maps and WhatsApp Business.",
      "Ask happy customers to leave reviews and share photos.",
    ],
  },
  {
    id: "promotions",
    title: "Run Targeted Promotions",
    icon: "🏷️",
    steps: [
      "Offer festival discounts during Pongal, Diwali, and local temple festivals.",
      "Run a 'buy one, get one' offer on slow-moving stock.",
      "Create a loyalty card: free item after 5 visits.",
      "Promote offers via WhatsApp status and local community groups.",
    ],
  },
  {
    id: "experience",
    title: "Enhance Customer Experience",
    icon: "👤",
    steps: [
      "Greet every customer by name and remember their usual orders.",
      "Keep the shop clean, well-lit, and organized at all times.",
      "Offer multiple payment options: UPI, cash, and card.",
      "Pack orders neatly with a thank-you note or visiting card.",
    ],
  },
  {
    id: "digital",
    title: "Use Local Digital Marketing",
    icon: "📱",
    steps: [
      "Create a simple Instagram/Facebook page with product photos.",
      "Share short reels of your shop and product-making process.",
      "List your shop on local MSME and Justdial directories.",
      "Collect customer phone numbers (with consent) for offer broadcasts.",
    ],
  },
];

const nextSteps = [
  "Update your shop signboard this week",
  "Set up WhatsApp Business catalog",
  "Run your first festival promotion",
  "Ask 5 happy customers for Google reviews",
];

const shortcuts = [
  "Create a marketing plan",
  "Generate festival offer poster",
  "Create customer return policy",
];

const UTILITY_ICONS: Record<string, React.ElementType> = {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Bookmark,
};

export default function AdvisorPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(["visibility"]));
  const [bookmarked, setBookmarked] = useState(false);

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "suggestions", label: "Suggestions" },
    { id: "saved", label: "Saved" },
    { id: "history", label: "History" },
  ];

  const toggleAccordion = (id: string) => {
    const next = new Set(openAccordions);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenAccordions(next);
  };

  return (
    <div className="px-4 py-3 sm:py-4 space-y-4 sm:space-y-6 text-slate-main min-h-full">
      {/* Sub-nav tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border-b-2",
                active
                  ? "border-teal-primary text-teal-primary bg-teal-primary/10"
                  : "border-transparent text-slate-muted hover:bg-slate-50 hover:text-slate-main",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Bot greeting */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 w-10 rounded-full bg-teal-primary/10 flex items-center justify-center text-teal-primary text-xs font-bold flex-shrink-0">
          AI
        </div>
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm leading-relaxed">
            Hi Mohamed! 👋 I&apos;m your Business Advisor. I know your business
            <span className="font-semibold text-teal-primary">(AFIYA Bags -
            Retail Shop in Tiruchirappalli)</span>. How can I help you
            today?
          </p>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {chips.map((c) => (
          <button
            key={c}
            className="flex-none px-4 py-2 rounded-full border border-slate-200 bg-white text-xs text-slate-muted text-sm font-medium hover:border-teal-primary hover:text-teal-primary transition-colors"
          >
            {c}
          </button>
        ))}
      </div>

      {/* AI structured response */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 w-10 rounded-full bg-teal-primary/10 flex items-center justify-center text-teal-primary text-xs font-bold flex-shrink-0 mt-1">
          AI
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm text-slate-main leading-relaxed">
            Based on your retail shop profile, here are four ways to grow
            your business in Tiruchirappalli:
          </p>
          {accordions.map((a) => {
            const open = openAccordions.has(a.id);
            return (
              <div
                key={a.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleAccordion(a.id)}
                  className="flex w-full items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 last:border-b-0 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm">{a.icon}</span>
                  <span className="flex-1 text-sm font-semibold text-slate-main">
                    {a.title}
                  </span>
                  <ChevronDown
                    className={cn("w-4 h-4 text-slate-muted", open && "rotate-180")}
                  />
                </button>
                {open && (
                  <div className="px-4 py-3 border-t border-slate-100 bg-[#f8fafc]">
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-muted">
                      {a.steps.map((s, i) => (
                        <li key={i} className="leading-snug">
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Utility icons */}
      <div className="flex justify-between items-center px-1">
        <div className="flex gap-2">
          {["ThumbsUp", "ThumbsDown", "Copy", "Bookmark"].map((name) => {
            const Icon = UTILITY_ICONS[name];
            return (
              <button
                key={name}
                className="p-2 rounded-full text-slate-muted hover:bg-teal-primary/10 hover:text-teal-primary transition-colors"
                aria-label={name}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
        <button
          className={cn(
            "p-2 rounded-full transition-all",
            bookmarked
              ? "text-teal-primary bg-teal-primary/10"
              : "text-slate-muted hover:text-slate-main hover:bg-slate-100",
          )}
          onClick={() => setBookmarked(!bookmarked)}
          aria-label="Bookmark"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Next steps callout */}
      <div className="rounded-xl border border-teal-primary/20 bg-teal-primary/5 p-4 shadow-sm">
        <div className="flex items-start gap-2">
          <span className="text-teal-primary font-bold mt-0.5">✓</span>
          <div>
            <p className="text-xs font-semibold text-teal-primary-dark uppercase tracking-wider mb-1">
              Next Steps
            </p>
            <ul className="text-sm text-slate-main space-y-1 leading-relaxed list-disc list-inside">
              {nextSteps.map((s) => (
                <li key={s} className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-xs text-green-600 font-bold">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action shortcut pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {shortcuts.map((s) => (
          <button
            key={s}
            className="flex-none flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs text-slate-main font-medium hover:border-teal-primary hover:text-teal-primary transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-primary" />
            {s}
          </button>
        ))}
      </div>

      {/* Bottom chat input */}
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="flex items-end gap-2">
          <button
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-muted hover:text-slate-main transition-colors"
            aria-label="Upload"
          >
            <Plus className="w-4 h-4" />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-main outline-none focus:ring-2 focus:ring-teal-primary/50 placeholder:text-slate-400"
          />
          <button
            className="p-2.5 rounded-full text-slate-muted hover:text-slate-main hover:bg-slate-100 transition-colors"
            aria-label="Microphone"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            className="px-5 py-3 rounded-xl bg-teal-primary text-white text-sm font-semibold shadow-lg shadow-teal-primary/25 hover:bg-teal-primary-hover transition-colors"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
