"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguagePill } from "@/components/LanguagePill";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    setLoading(true);
    // Auth integration stub — wire up Convex/Clerk here when available
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-main">
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Logo width={30} />
          </div>
          <LanguagePill lang={lang} onChange={setLang} className="flex-shrink-0" />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {/* Illustration */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/business-assistant-illustration.png"
              alt="Business owner with thought bubbles"
              width={400}
              height={300}
              className="max-w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-teal-primary-dark tracking-tight">
                  Create Your Account
                </h2>
                <p className="text-sm text-slate-muted">
                  Start building a smarter business with AI.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-muted uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-main outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary transition-colors placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-muted uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-main outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary transition-colors placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-muted uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-teal-primary font-medium hover:underline transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-main outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary transition-colors placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-muted uppercase tracking-wider block">
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-xs text-teal-primary font-medium hover:underline transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-main outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary transition-colors placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-primary transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="mt-1 rounded border-slate-200 text-teal-primary focus:ring-teal-primary"
                />
                <label className="text-sm text-slate-main leading-none cursor-pointer select-none">
                  I agree to the{" "}
                  <Link
                    href="#terms"
                    className="text-teal-primary font-semibold hover:underline transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  {" "}
                  and{" "}
                  <Link
                    href="#privacy"
                    className="text-teal-primary font-semibold hover:underline transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !termsAccepted}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5 rounded-full text-white text-sm font-semibold shadow-lg shadow-teal-primary/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed",
                  loading || !termsAccepted
                    ? "bg-slate-300"
                    : "bg-teal-primary hover:bg-teal-primary-hover",
                )}
              >
                {loading ? (
                  <ArrowRight className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-primary font-semibold hover:underline transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
