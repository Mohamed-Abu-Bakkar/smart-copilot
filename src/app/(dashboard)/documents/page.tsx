"use client";

import Link from "next/link";
import { FileText, Edit2, Plus } from "lucide-react";

const templates = [
  {
    title: "Customer Return Policy",
    desc: "Define return, refund, and exchange terms for shoppers.",
    icon: FileText,
  },
  {
    title: "Sales Invoice Template",
    desc: "Professional invoice format for your retail sales.",
    icon: FileText,
  },
  {
    title: "GST Registration Letter",
    desc: "Draft letter for GST registration application.",
    icon: FileText,
  },
  {
    title: "Supplier Agreement",
    desc: "Terms with vendors and wholesale suppliers.",
    icon: FileText,
  },
];

const recent = [
  { title: "Return Policy Draft", status: "Draft", updated: "2 hours ago" },
  { title: "Supplier Agreement", status: "Saved", updated: "1 day ago" },
  { title: "Sales Invoice Template", status: "Exported", updated: "3 days ago" },
];

export default function DocumentsPage() {
  return (
    <div className="px-4 py-3 sm:py-4 space-y-4 sm:space-y-6 text-slate-main min-h-full">
      <section>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-teal-primary" />
        </div>
        <p className="text-sm text-slate-muted">Create, save, and manage essential business policies and documents.</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Active Business:</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-primary/30 bg-teal-primary/5 text-teal-primary text-xs font-semibold shadow-sm">
            AFIYA Bags
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Document Templates</h3>
        <div className="grid gap-3">
          {templates.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-teal-primary/10 text-teal-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Link
                    href="/documents/create"
                    className="text-[10px] text-teal-primary font-semibold hover:underline"
                  >
                    Create <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <h4 className="text-sm font-semibold text-slate-main">{t.title}</h4>
                <p className="text-xs text-slate-muted mt-1 leading-snug">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Recent Documents</h3>
          <button className="text-xs text-teal-primary font-semibold hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {recent.map((r) => (
            <div
              key={r.title}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-main truncate">{r.title}</p>
                <p className="text-xs text-slate-muted">
                  <span className="px-1.5 py-0.5 rounded text-[10px] border border-slate-200 text-slate-muted">
                    {r.status}
                  </span>{" "}
                  {r.updated}
                </p>
              </div>
              <Edit2 className="w-4 h-4 text-slate-300 hover:text-slate-main" />
            </div>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-main hover:bg-slate-50 transition-colors">
          <Plus className="w-4 h-4" />
          Create New Document
        </button>
      </section>
    </div>
  );
}
