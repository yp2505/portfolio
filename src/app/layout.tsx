import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yug Patel | AI Developer",
  description: "Portfolio of Yug Patel, an AI & ML Developer",
};

import BackgroundWrapper from "@/components/BackgroundWrapper";
import TopMenu from "@/components/ui/TopMenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <BackgroundWrapper />
        
        <div className="relative z-10 w-full min-h-screen">
          <TopMenu />
          <main className="w-full min-h-screen pt-7">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
