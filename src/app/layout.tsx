import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProviders } from "@/components/AuthProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Smart Copilot — AI Business Copilot for MSMEs",
  description: "AI-powered business guidance, government schemes, and document creation for micro and small businesses in India.",
};

function AppLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-sm text-muted-foreground">
      Loading Smart Copilot…
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable + " font-sans antialiased"}>
        <Suspense fallback={<AppLoadingFallback />}>
          <AuthProviders>{children}</AuthProviders>
        </Suspense>
      </body>
    </html>
  );
}
