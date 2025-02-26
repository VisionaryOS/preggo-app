import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PregnancyPlus - Your Complete Pregnancy Companion",
  description: "Track your pregnancy journey, get personalized insights, and connect with a supportive community - all in one beautifully designed app.",
  metadataBase: new URL("https://pregnancyplus.app"),
  keywords: ["pregnancy", "pregnant", "mom", "baby", "health", "tracking", "prenatal care"],
  openGraph: {
    title: "PregnancyPlus - Your Complete Pregnancy Companion",
    description: "Track your pregnancy journey, get personalized insights, and connect with a supportive community - all in one beautifully designed app.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PregnancyPlus App",
      }
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
