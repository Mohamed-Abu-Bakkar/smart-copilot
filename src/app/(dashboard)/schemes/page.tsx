"use client";

import { useState } from "react";
import { Search, Mic, Building2, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = ["All", "MSME", "Loans", "Subsidy", "Training", "Marketing"];

const recommended = [
  {
    name: "PMEGP Scheme",
    dept: "Ministry of MSME",
    badge: "MSME",
    benefit: "Up to ₹50 Lakhs Subsidy",
    scope: "Manufacturing & Service · All India",
  },
  {
    name: "MSME Marketing Assistance Scheme",
    dept: "Ministry of MSME",
    badge: "Subsidy",
    benefit: "Up to 75% of expenses",
    scope: "Marketing · All India",
  },
  {
    name: "Mudra Loan Scheme",
    dept: "SIDBI",
    badge: "Loan",
    benefit: "Up to ₹10 Lakhs",
    scope: "Small Business · All India",
  },
];

const allSchemes = [
  {
    name: "PMEGP - Prime Minister's Employment Generation Programme",
    dept: "Ministry of MSME",
    emblem: "GOI",
    tags: ["MSME", "Subsidy"],
    benefit: "Up to ₹50 Lakhs",
    eligibility: "Manufacturing & Service",
    scope: "All India",
    verified: "Verified · 2024",
  },
  {
    name: "Mudra Loan - Shishu/Kishor/Tarun",
    dept: "SIDBI",
    emblem: "SIDBI",
    tags: ["Loan"],
    benefit: "Up to ₹10 Lakhs",
    eligibility: "Small Business",
    scope: "All India",
    verified: "Verified · 2024",
  },
  {
    name: "Tamil Nadu MSME Capital Subsidy",
    dept: "Tamil Nadu Govt",
    emblem: "TN",
    tags: ["Subsidy", "Training"],
    benefit: "Up to 25% subsidy",
    eligibility: "MSME in Tamil Nadu",
    scope: "Tamil Nadu",
    verified: "Verified · 2024",
  },
  {
    name: "Credit Guarantee Fund Trust (CGTMSE)",
    dept: "Ministry of MSME",
    emblem: "GOI",
    tags: ["Loan", "Guarantee"],
    benefit: "Collateral-free loans",
    eligibility: "Micro & Small Enterprises",
    scope: "All India",
    verified: "Verified · 2024",
  },
];

const BADGE_STYLE: Record<string, string> = {
  MSME: "bg-blue-50 text-blue-700 border-blue-100",
  Subsidy: "bg-green-50 text-green-700 border-green-100",
  Loan: "bg-orange-50 text-orange-700 border-orange-100",
  Training: "bg-purple-50 text-purple-700 border-purple-100",
  Marketing: "bg-pink-50 text-pink-700 border-pink-100",
  Guarantee: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

export default function SchemesPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="px-4 py-3 sm:py-4 space-y-4 sm:space-y-6 text-slate-main min-h-full">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-teal-primary" />
        </div>
        <p className="text-sm text-slate-muted">Support for your business growth</p>
      </section>

      {/* Hero Banner */}
      <section className="rounded-2xl border border-teal-primary/20 bg-gradient-to-br from-teal-primary to-teal-primary-dark p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Government support for your growth</h2>
            <p className="text-teal-primary/50 text-sm mt-1">Discover MSME schemes, loans, and subsidies you may qualify for.</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
            <Building2 className="w-8 h-8 text-teal-primary-dark" />
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search schemes (e.g., MSME, subsidy, loan...)"
              className="pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-[#f8fafc]/40 text-sm text-slate-main outline-none focus:ring-2 focus:ring-teal-primary/50 placeholder:text-slate-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-muted" aria-label="Mic">
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  active
                    ? "bg-teal-primary border-teal-primary text-white"
                    : "border-slate-200 bg-white text-slate-muted hover:bg-slate-50",
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
      </section>

      {/* Recommended schemes horizontal */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Recommended Schemes</h3>
          <button className="text-xs text-teal-primary font-semibold hover:underline">View all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recommended.map((s) => (
            <div
              key={s.name}
              className="flex-none w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${BADGE_STYLE[s.badge]}`}>
                  {s.badge}
                </span>
                <span className="text-[10px] text-slate-muted">· {s.dept}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-main leading-snug">{s.name}</h4>
              <p className="text-[10px] text-slate-muted">{s.scope}</p>
              <div className="mt-auto pt-2">
                <span className="text-sm font-bold text-teal-primary-dark">{s.benefit}</span>
              </div>
              <button className="mt-2 flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-main font-medium hover:bg-slate-50 transition-colors">
                View Details <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* All relevant schemes vertical */}
      <section className="space-y-2 sm:space-y-3">
        <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-3">All Relevant Schemes</h3>
        <div className="space-y-2">
          {allSchemes.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 text-slate-main text-xs font-bold mt-0.5">
                  {s.emblem}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${BADGE_STYLE[t]}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-main leading-snug">{s.name}</h4>
                  <p className="text-[10px] text-slate-muted leading-snug mt-0.5">
                    {s.dept} · {s.eligibility} · {s.scope}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-primary-dark">{s.benefit}</span>
                  <p className="text-[10px] text-slate-muted mt-0.5">{s.verified}</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100">
                <button className="flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-teal-primary/30 bg-teal-primary/5 text-teal-primary text-xs font-semibold hover:bg-teal-primary/10 transition-colors">
                  View Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
