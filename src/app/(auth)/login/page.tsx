"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, LoaderCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguagePill } from "@/components/LanguagePill";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "ta">("en");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Enter your email address and password.");
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email: email.trim().toLowerCase(), password, callbackURL: "/home" });
      if (result.error) throw new Error(result.error.message || "Unable to sign in.");
      router.replace("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-main">
      <header className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2"><Logo width={30} /><LanguagePill lang={lang} onChange={setLang} /></div>
      </header>
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex justify-center mb-8"><Image src="/images/business-assistant-illustration.png" alt="Business owner with thought bubbles" width={400} height={300} className="max-w-full h-auto object-contain" priority /></div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><h2 className="text-2xl font-bold text-teal-primary-dark tracking-tight">Welcome Back!</h2><p className="text-sm text-slate-muted mt-1">Sign in to continue to your business workspace.</p></div>
              {error && <div role="alert" className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">{error}</div>}
              <label className="block space-y-2"><span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Email Address</span><span className="relative block"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary" /></span></label>
              <label className="block space-y-2"><span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Password</span><span className="relative block"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input required type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" className="w-full pl-9 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary" /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-primary">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></span></label>
              <button type="submit" disabled={loading} className={cn("w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-full text-white text-sm font-semibold shadow-lg shadow-teal-primary/25 disabled:opacity-60", "bg-teal-primary hover:bg-teal-primary-hover")}>{loading ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Signing in…</> : <>Sign in <ArrowRight className="w-4 h-4" /></>}</button>
              <p className="text-xs text-center text-slate-muted">Your account and business workspace are stored securely with Smart Copilot.</p>
            </form>
          </div>
          <p className="mt-6 text-center text-sm">Don&apos;t have an account? <Link href="/signup" className="text-teal-primary font-semibold hover:underline">Create account</Link></p>
        </div>
      </main>
    </div>
  );
}
