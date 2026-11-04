"use client";

import { useState } from "react";
import { ArrowLeft, Mic, Send, Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguagePill } from "@/components/LanguagePill";
import { cn } from "@/lib/utils";

type Product = "Clothing" | "Bags" | "Footwear" | "Other";
type StoreType = "Physical" | "Online" | "Both";

const PRODUCTS: Product[] = ["Clothing", "Bags", "Footwear", "Other"];
const STORE_TYPES: StoreType[] = ["Physical", "Online", "Both"];

interface Phase {
  id: string;
  bot: string;
  kind: "products" | "store" | "done";
}

const PHASES: Phase[] = [
  {
    id: "products",
    bot: "Nice! A retail shop. What products do you sell?",
    kind: "products",
  },
  {
    id: "store",
    bot: "Great choices. Will you sell from a physical store, online, or both?",
    kind: "store",
  },
  {
    id: "done",
    bot: "Perfect! Your profile is almost complete. Let's finish up.",
    kind: "done",
  },
];

export default function ProfileBuilderPage() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Set<Product>>(new Set());
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const phase = PHASES[phaseIndex];
  const isLast = phaseIndex === PHASES.length - 1;

  const userReply =
    phase.kind === "products" && selectedProducts.size > 0
      ? [...selectedProducts].join(" and ")
      : phase.kind === "store" && selectedStore
      ? `${selectedStore} Store`
      : isLast && !submitted
      ? "Profile complete"
      : null;

  const toggleProduct = (p: Product) => {
    const next = new Set(selectedProducts);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setSelectedProducts(next);
  };

  const nextPhase = () => {
    if (isLast) {
      setSubmitted(true);
      return;
    }
    if (phase.kind === "products" && selectedProducts.size === 0) return;
    if (phase.kind === "store" && !selectedStore) return;
    setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));
  };

  const productSelected = (p: Product) => selectedProducts.has(p);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-main">
      {/* Header */}
      <header className="px-4 py-4 sm:px-5 sm:py-4 border-b border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => {}}
            className="p-2 rounded-md text-slate-muted hover:text-slate-main hover:bg-slate-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <Logo width={26} className="mx-auto" />
          </div>
          <LanguagePill lang="en" onChange={() => {}} className="flex-shrink-0" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 py-4 sm:px-5 sm:py-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          {[
            "Profile",
            "Details",
            "Operations",
            "Goals",
            "Complete",
          ].map((step, i) => (
            <div key={step} className={cn(
              "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              i === 1
                ? "bg-teal-primary/10 border border-teal-primary text-teal-primary font-semibold"
                : "bg-white border border-slate-200 text-slate-muted hover:bg-slate-50",
            )}>
              {step}
              {i < 4 && (
                <span className="mx-1 text-slate-muted">➔</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="max-w-2xl mx-auto px-4 py-3 sm:px-5 sm:py-4 flex-1">
        <div className="flex flex-col gap-6">
          {/* Bot message */}
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full bg-teal-primary/10 flex items-center justify-center text-teal-primary text-xs font-bold flex-shrink-0">
              AI
            </div>
            <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm leading-relaxed">{phase.bot}</p>
            </div>
          </div>

          {/* Options */}
          {phase.kind === "products" && (
            <>
              <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-3">
                Select all that apply
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PRODUCTS.map((p) => {
                  const sel = productSelected(p);
                  return (
                    <button
                      key={p}
                      onClick={() => toggleProduct(p)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200",
                        sel
                          ? "border-teal-primary bg-[#e6fffa]/60 shadow-[0_0_0_1px_rgba(15,118,110,0.35)]"
                          : "border-slate-200 bg-white hover:border-teal-primary/30",
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-1 bg-slate-100 text-slate-muted">
                        {p === "Clothing" && "👕"}
                        {p === "Bags" && "👜"}
                        {p === "Footwear" && "👞"}
                        {p === "Other" && "📦"}
                      </div>
                      <span className="text-xs font-medium">{p}</span>
                      {sel && (
                        <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-white text-[9px] shadow-sm border border-white">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedProducts.size > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-primary/20 bg-teal-primary/5 px-3 py-1.5">
                  <span className="text-teal-primary text-[10px] font-semibold uppercase tracking-wider">Selected:</span>
                  <span className="text-xs text-slate-main">
                    {[...selectedProducts].join(", ")}
                  </span>
                </div>
              )}
            </>
          )}

          {phase.kind === "store" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {STORE_TYPES.map((t) => {
                const sel = selectedStore === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedStore(t)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200",
                      sel
                        ? "border-teal-primary bg-[#e6fffa]/60 shadow-[0_0_0_1px_rgba(15,118,110,0.35)]"
                        : "border-slate-200 bg-white hover:border-teal-primary/30",
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-1 bg-slate-100 text-slate-muted">
                      {t === "Physical" && "🏪"}
                      {t === "Online" && "🛒"}
                      {t === "Both" && "🏪🛒"}
                    </div>
                    <span className="text-xs font-medium capitalize">{t}</span>
                    {sel && (
                      <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-white text-[9px] shadow-sm border border-white">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* User reply pill (confirmation) */}
          {userReply && (
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-2xl border border-teal-primary/30 bg-teal-primary/5 px-4 py-3 ml-auto">
                <p className="text-xs text-teal-primary font-medium">You:</p>
                <p className="text-sm text-slate-main mt-0.5">{userReply}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 sticky bottom-0 z-30">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-md text-slate-muted hover:text-slate-main hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type your reply..."
            className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-main outline-none focus:ring-2 focus:ring-teal-primary/50 placeholder:text-slate-400"
          />
          <button
            className="p-2.5 rounded-full text-slate-muted hover:text-slate-main hover:bg-slate-100 transition-colors"
            aria-label="Microphone"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={nextPhase}
            disabled={
              (phase.kind === "products" && selectedProducts.size === 0) ||
              (phase.kind === "store" && !selectedStore)
            }
            className="px-5 py-2.5 rounded-full bg-teal-primary text-white text-sm font-semibold shadow-lg shadow-teal-primary/25 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-primary-hover transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {submitted && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-teal-primary flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-teal-primary-dark">Profile Complete</h3>
            <p className="text-slate-muted mt-1">Welcome to Smart Copilot!</p>
          </div>
        </div>
      )}
    </div>
  );
}
