import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/lib/providers";
import { AppProgressBar } from "@/components/ui/app-progress-bar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "NuMama - Your Complete Pregnancy Companion",
  description: "Track your pregnancy journey, get personalized insights, and connect with a supportive community - all in one beautifully designed app.",
  metadataBase: new URL("https://numama.app"),
  keywords: ["pregnancy", "pregnant", "mom", "baby", "health", "tracking", "prenatal care"],
  openGraph: {
    title: "NuMama - Your Complete Pregnancy Companion",
    description: "Track your pregnancy journey, get personalized insights, and connect with a supportive community - all in one beautifully designed app.",
    type: "website",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <Providers>
          <AppProgressBar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
