"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, LoaderCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguagePill } from "@/components/LanguagePill";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "ta">("en");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) return setError("Please complete all fields.");
    if (password.length < 8) return setError("Use a password with at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!termsAccepted) return setError("Please accept the Terms and Conditions.");
    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/onboarding",
      });
      if (result.error) throw new Error(result.error.message || "Unable to create your account.");
      router.replace("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-main">
      <header className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20"><div className="max-w-md mx-auto flex items-center justify-between gap-2"><Logo width={30} /><LanguagePill lang={lang} onChange={setLang} /></div></header>
      <main className="flex-1"><div className="max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex justify-center mb-8"><Image src="/images/business-assistant-illustration.png" alt="Business owner with thought bubbles" width={400} height={300} className="max-w-full h-auto object-contain" priority /></div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><h2 className="text-2xl font-bold text-teal-primary-dark tracking-tight">Create Your Account</h2><p className="text-sm text-slate-muted mt-1">One account for your business profile, advice and documents.</p></div>
            {error && <div role="alert" className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">{error}</div>}
            <label className="block space-y-2"><span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Full Name</span><span className="relative block"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input required autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-primary" /></span></label>
            <label className="block space-y-2"><span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Email Address</span><span className="relative block"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-primary" /></span></label>
            <label className="block space-y-2"><span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Password (minimum 8 characters)</span><span className="relative block"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="w-full pl-9 pr-12 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-primary" /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-primary">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></span></label>
            <label className="block space-y-2"><span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Confirm Password</span><span className="relative block"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input required type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full pl-9 pr-12 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-primary" /><button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-primary">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></span></label>
            <label className="flex items-start gap-2 text-xs text-slate-muted"><input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-0.5" /><span>I agree to the Terms &amp; Conditions and Privacy Policy.</span></label>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-full bg-teal-primary hover:bg-teal-primary-hover text-white p-3.5 text-sm font-semibold disabled:opacity-60">{loading ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Creating account…</> : <>Create account <ArrowRight className="w-4 h-4" /></>}</button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm">Already have an account? <Link href="/login" className="text-teal-primary font-semibold hover:underline">Sign in</Link></p>
      </div></main>
    </div>
  );
}
