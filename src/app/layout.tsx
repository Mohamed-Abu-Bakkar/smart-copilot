import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getToken } from "@/lib/auth-server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Smart Copilot — AI Business Copilot for MSMEs",
  description: "AI-powered business guidance, government schemes, and document creation for micro and small businesses in India.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token = await getToken();
  return (
    <html lang="en">
      <body className={inter.variable + " font-sans antialiased"}>
        <ConvexClientProvider initialToken={token}>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
