import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Campus Exchange — Buy & Sell on Your Campus",
  description:
    "Find affordable books, engineering tools, electronics, and hostel essentials from students in your own college. Join Campus Exchange today.",
  keywords: ["campus marketplace", "student marketplace", "buy sell college", "second hand books", "engineering tools"],
  openGraph: {
    title: "Campus Exchange — Buy & Sell on Your Campus",
    description:
      "Find affordable books, engineering tools, electronics, and hostel essentials from students in your own college.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
