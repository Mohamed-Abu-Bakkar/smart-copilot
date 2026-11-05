"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoInline } from "./Logo";
import { LanguagePill } from "./LanguagePill";
import { useDemoWorkspace } from "@/lib/demo-workspace";
import { authClient } from "@/lib/auth-client";

interface DashboardHeaderProps {
  onMenu?: () => void;
  lang: "en" | "ta";
  onLangChange: (lang: "en" | "ta") => void;
  className?: string;
}

export function DashboardHeader({ onMenu, lang, onLangChange, className }: DashboardHeaderProps) {
  const { profile } = useDemoWorkspace();
  const router = useRouter();
  const initials = profile?.businessName
    ? profile.businessName.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join("")
    : "B";

  async function signOut() {
    await authClient.signOut();
    router.replace("/login");
  }

  return (
    <div className={cn("flex items-center justify-between gap-2 md:gap-4 px-4 py-3.5 border-b border-slate-200 bg-white", className)}>
      <div className="flex items-center gap-2">
        {onMenu && <button onClick={onMenu} className="shrink-0 rounded-md p-1.5 text-slate-muted transition-colors hover:bg-slate-100 hover:text-slate-main" aria-label="Open menu"><Menu className="h-5 w-5" /></button>}
        <LogoInline className="flex-shrink-0" />
      </div>
      <div className="flex items-center gap-2">
        <LanguagePill lang={lang} onChange={onLangChange} />
        <Link href="/business" className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-main transition-colors hover:bg-slate-50" aria-label="Open business profile">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-primary text-[10px] font-bold text-white">{initials}</span>
          <span className="hidden max-w-24 truncate text-xs sm:inline">{profile?.businessName || "My business"}</span>
          <ChevronDown className="h-3 w-3 text-slate-muted" />
        </Link>
        <button type="button" onClick={() => void signOut()} className="inline-flex items-center gap-1 rounded-full p-2 text-slate-muted hover:bg-slate-100 hover:text-slate-main" aria-label="Sign out" title="Sign out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
