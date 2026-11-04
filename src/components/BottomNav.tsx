"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  MessageCircle,
  Building2,
  FileText,
  Store,
} from "lucide-react";

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/advisor", icon: MessageCircle, label: "Advisor" },
  { href: "/schemes", icon: Building2, label: "Schemes" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/business", icon: Store, label: "My Business" },
];

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className }: BottomNavProps = {}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex w-full border-t border-slate-200 bg-white/90 backdrop-blur-md",
        className,
      )}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 px-2 py-2.5 text-sm transition-colors",
              active
                ? "text-teal-primary"
                : "text-slate-muted hover:text-teal-primary",
            )}
          >
            <Icon className={cn("w-5 h-5", active ? "text-teal-primary" : "")} />
            <span className={cn("leading-none", active ? "font-semibold" : "font-medium")}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
