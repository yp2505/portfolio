import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/themeContext";

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

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yug Patel | AI Developer",
  description: "Portfolio of Yug Patel, an AI & ML Developer",
};

// mobile-native skill: theme-color per color scheme
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // viewport-fit=cover: paint edge-to-edge under notch/Dynamic Island
  viewportFit: "cover",
  // interactive-widget: keyboard shrinks layout on Android Chrome
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#020408" },
    { media: "(prefers-color-scheme: dark)", color: "#020408" },
  ],
};

import BackgroundWrapper from "@/components/BackgroundWrapper";
import TopMenu from "@/components/ui/TopMenu";
import MobilePillNavWrapper from "@/components/ui/MobilePillNavWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${dancingScript.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <ThemeProvider>
        <BackgroundWrapper />

        <div className="relative z-10 w-full min-h-screen">
          {/* TopMenu — hidden on mobile via CSS */}
          <TopMenu />

          {/* Mobile pill nav + back button — hidden on desktop via CSS */}
          <MobilePillNavWrapper />

          <main className="w-full min-h-screen pt-7">
            {children}
          </main>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
