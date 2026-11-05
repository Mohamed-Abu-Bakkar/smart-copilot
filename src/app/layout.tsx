"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DemoWorkspaceProvider } from "@/lib/demo-workspace";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "Smart Copilot — AI Business Copilot for MSMEs", description: "AI-powered business guidance, government schemes, and document creation for micro and small businesses in India." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en"><body className={inter.variable + " font-sans antialiased"}><DemoWorkspaceProvider>{children}</DemoWorkspaceProvider></body></html>;
}