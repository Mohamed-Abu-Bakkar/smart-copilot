"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguagePill } from "@/components/LanguagePill";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "ta">("en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Auth integration stub — wire up Convex/Clerk here when available
    setTimeout(() => {
      setLoading(false);
      router.push("/home");
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
                  Welcome Back!
                </h2>
                <p className="text-sm text-slate-muted">
                  Your business journey continues with AI.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}

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

              <div className="flex justify-end">
                <Link
                  href="#forgot-password"
                  className="text-xs text-teal-primary font-medium hover:underline transition-colors"
                >
                  Forgot Password&apos;?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5 rounded-full text-white text-sm font-semibold shadow-lg shadow-teal-primary/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed",
                  loading
                    ? "bg-slate-300"
                    : "bg-teal-primary hover:bg-teal-primary-hover",
                )}
              >
                {loading ? (
                  <ArrowRight className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Login <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-muted">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>

              {/* Google Auth — not wired to existing auth provider; shown as UI option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <span className="relative text-xs text-slate-muted px-2 bg-white">
                  Or continue with
                </span>
              </div>
              <button
                type="button"
                onClick={() => {}}
                disabled={loading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-main text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-70",
                )}
              >
                Google
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-teal-primary font-semibold hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
