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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://yugpatel.dev"),
  title: {
    default: "Yug Patel — Portfolio",
    template: "%s · Yug Patel",
  },
  description: "Portfolio of Yug Patel — AI and machine learning developer.",
  keywords: ["Yug Patel", "portfolio", "AI developer", "machine learning", "data engineering"],
  authors: [{ name: "Yug Patel" }],
  creator: "Yug Patel",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Yug Patel — Portfolio",
    title: "Yug Patel — Portfolio",
    description: "Portfolio of Yug Patel — AI and machine learning developer.",
    images: [{ url: "/assets/yug.png", width: 1200, height: 630, alt: "Yug Patel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yug Patel — Portfolio",
    description: "Portfolio of Yug Patel — AI and machine learning developer.",
    images: ["/assets/yug.png"],
  },
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
import { ControlCenterProvider } from "@/components/control-center/useControlCenter";
import BrightnessOverlay from "@/components/control-center/BrightnessOverlay";
import SimulatedOfflineBanner from "@/components/control-center/SimulatedOfflineBanner";
import MobileControlCenter from "@/components/control-center/MobileControlCenter";
import SpotifyConnectModal from "@/components/control-center/SpotifyConnectModal";

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
          <ControlCenterProvider>
            <BackgroundWrapper />
            <BrightnessOverlay />
            <SimulatedOfflineBanner />
            <MobileControlCenter />
            <SpotifyConnectModal />

            <div className="relative z-10 w-full min-h-screen">
              {/* TopMenu — hidden on mobile via CSS */}
              <TopMenu />

              {/* Mobile pill nav + back button — hidden on desktop via CSS */}
              <MobilePillNavWrapper />

              <main className="w-full min-h-screen pt-7">
                {children}
              </main>
            </div>
          </ControlCenterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
