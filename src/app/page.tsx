"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BarChart3, Building2, FileText, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { LanguagePill } from "@/components/LanguagePill";
import { cn } from "@/lib/utils";

const bubbles = [
  {
    label: "Get Business Guidance",
    icon: <BarChart3 className="w-3 h-3" />,
    iconColor: "text-blue-500",
    top: "8%",
    left: "-24%",
    delay: 0,
  },
  {
    label: "Find Government Schemes",
    icon: <Building2 className="w-3 h-3" />,
    iconColor: "text-emerald-500",
    top: "6%",
    right: "-24%",
    delay: 0.4,
  },
  {
    label: "Create Policies & Documents",
    icon: <FileText className="w-3 h-3" />,
    iconColor: "text-violet-500",
    top: "52%",
    left: "-24%",
    delay: 0.8,
  },
  {
    label: "Grow Your Business",
    icon: <Lightbulb className="w-3 h-3" />,
    iconColor: "text-amber-500",
    top: "52%",
    right: "-24%",
    delay: 1.2,
  },
];

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "ta">("en");

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-main">
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Logo width={30} />
            <span className="text-slate-muted text-xs font-medium tracking-tight uppercase">
              for Micro and Small Businesses
            </span>
          </div>
          <LanguagePill lang={lang} onChange={setLang} />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-24 relative z-10">
          {/* Business illustration (above tagline) */}
          <div className="relative h-[300px] sm:h-[420px] flex items-center justify-center mb-10 sm:mb-12">
            <Image
              src="/images/business-assistant-illustration.png"
              alt="Business owner with thought bubbles"
              width={400}
              height={300}
              className="max-w-full h-auto object-contain drop-shadow-2xl"
              priority
            />

            {bubbles.map((b) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, -14, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: b.delay,
                }}
                className={cn(
                  "absolute rounded-2xl border border-slate-200 bg-white/80 backdrop-blur px-3 py-1.5 text-xs font-medium text-slate-main shadow-sm flex items-center gap-2 whitespace-nowrap",
                  b.top,
                  b.left,
                  b.right,
                )}
              >
                <span className={cn(b.iconColor)}>{b.icon}</span>
                {b.label}
              </motion.div>
            ))}
          </div>

          {/* Hero content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-primary/20 bg-teal-primary/5 px-3 py-1 sm:px-4 sm:py-1.5 text-teal-primary text-xs font-semibold uppercase tracking-wider">
              AI-Powered Business Copilot
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-teal-primary-dark leading-tight text-center sm:text-left">
              Your Business. <br />
              <span className="text-teal-primary">Your AI Assistant.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-muted leading-relaxed max-w-sm sm:max-w-md mx-auto sm:mx-0 text-center sm:text-left">
              Get expert guidance, discover opportunities, and create essential
              business documents —all in one app.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
              <Link
                href="/onboarding"
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-teal-primary text-white text-sm font-semibold shadow-lg shadow-teal-primary/25 hover:bg-teal-primary-hover transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full border border-slate-200 bg-white text-slate-main text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Login to Existing Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Feature value badges footer row */}
      <div className="border-t border-slate-200 bg-white py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8">
            {["⚡ Simple and Easy", "🛡️ Trusted Information", "👥 For Micro & Small Businesses", "🌱 In Your Language"].map(
              (badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 sm:px-5 sm:py-2 text-xs font-medium text-slate-muted"
                >
                  {badge}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
