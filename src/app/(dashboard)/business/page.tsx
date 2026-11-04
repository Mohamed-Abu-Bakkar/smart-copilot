"use client";

import Link from "next/link";
import { Edit2, Store, Building2, MapPin, Tag } from "lucide-react";

const profile = {
  name: "AFIYA Bags",
  category: "Retail Shop",
  industry: "Fashion & Accessories",
  location: "Tiruchirappalli, Tamil Nadu",
  stage: "Established",
  storeType: "Physical Store",
  products: ["Clothing", "Bags", "Footwear"],
  employeeCount: 3,
  investmentBudget: "₹2–5 Lakhs",
  registrations: ["GST Registration", "Udyam Registration"],
};

const stats = [
  { label: "Employees", value: "3" },
  { label: "Registrations", value: "2" },
  { label: "Products", value: "3 categories" },
];

export default function BusinessPage() {
  return (
    <div className="px-4 py-3 sm:py-4 space-y-4 sm:space-y-6 text-slate-main min-h-full">
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Store className="w-5 h-5 text-teal-primary" />
        </div>
        <p className="text-sm text-slate-muted">Manage your business profile and details.</p>
        <div className="flex items-center gap-3 mt-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-main hover:bg-slate-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </section>

      {/* Business card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e6fffa] text-teal-primary font-bold text-lg shadow-sm">
            🏪
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-semibold text-slate-main">{profile.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-primary/10 text-teal-primary font-bold">{profile.stage}</span>
            </div>
            <p className="text-xs text-slate-muted">{profile.category} · {profile.industry}</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-3 h-3 text-slate-muted" />
              <span className="text-xs text-slate-muted">{profile.location}</span>
            </div>
          </div>
          <Link
            href="/documents"
            className="px-4 py-2 rounded-lg border border-teal-primary/30 bg-teal-primary/5 text-teal-primary text-xs font-semibold hover:bg-teal-primary/10 transition-colors"
          >
            Create Document
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-4">At a Glance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"
            >
              <span className="block text-sm font-bold text-teal-primary-dark">{s.value}</span>
              <span className="block text-xs text-slate-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="space-y-2 sm:space-y-3">
        <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Business Details</h3>
        <div className="space-y-2">
          {[
            { label: "Store Type", value: profile.storeType, icon: Building2 },
            { label: "Location", value: profile.location, icon: MapPin },
            { label: "Products", value: profile.products.join(", "), icon: Tag },
          ].map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-white"
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-muted">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-main">{d.value}</span>
                <span className="ml-auto text-xs font-medium text-slate-muted capitalize">{d.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Registrations */}
      <section className="space-y-2 sm:space-y-3">
        <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Registrations</h3>
        <div className="flex flex-wrap gap-2">
          {profile.registrations.map((r) => (
            <div
              key={r}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-muted font-medium"
            >
              {r}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
