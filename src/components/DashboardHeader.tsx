"use client";

import { Bell, ChevronDown, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoInline } from "./Logo";
import { LanguagePill } from "./LanguagePill";

interface DashboardHeaderProps {
  onMenu?: () => void;
  lang: "en" | "ta";
  onLangChange: (lang: "en" | "ta") => void;
  className?: string;
}

export function DashboardHeader({
  onMenu,
  lang,
  onLangChange,
  className,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 md:gap-4 px-4 py-3.5 border-b border-slate-200 bg-white",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {onMenu && (
          <button
            onClick={onMenu}
            className="p-1.5 rounded-md text-slate-muted hover:text-slate-main hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <LogoInline className="flex-shrink-0" />
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <LanguagePill lang={lang} onChange={onLangChange} />

        <div className="relative ml-1 md:ml-2">
          <button
            className="relative p-1.5 rounded-full text-slate-muted hover:text-teal-primary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-red-500 border border-white" />
            </span>
          </button>
        </div>

        <div className="relative ml-1 md:ml-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-main text-sm font-medium hover:bg-slate-50 transition-colors"
            aria-label="Profile"
          >
            <span className="h-7 w-7 rounded-full bg-teal-primary flex items-center justify-center text-white text-[10px] font-bold">
              MA
            </span>
            <ChevronDown className="w-3 h-3 text-slate-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}
