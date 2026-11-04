"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { BottomNav } from "@/components/BottomNav";

const DASHBOARD_ROUTES = ["/", "/advisor", "/schemes", "/documents", "/business"];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [lang, setLang] = useState<"en" | "ta">("en");
  const showBottomNav = DASHBOARD_ROUTES.includes(pathname);

  return (
    <div className="max-w-md mx-auto bg-white h-screen shadow-xl relative flex flex-col">
      <DashboardHeader
        lang={lang}
        onLangChange={setLang}
        className="flex-shrink-0 z-20"
      />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      {showBottomNav && (
        <BottomNav className="absolute bottom-0 left-0 right-0 z-30" />
      )}
    </div>
  );
}
