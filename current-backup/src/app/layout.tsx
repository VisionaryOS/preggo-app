import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@/lib/providers/query-client-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PregnancyPlus - Your Complete Pregnancy Companion",
  description:
    "Track your pregnancy journey, get personalized insights, and connect with a supportive community - all in one beautifully designed app.",
  keywords: [
    "pregnancy",
    "pregnant",
    "mom",
    "baby",
    "health",
    "tracking",
    "prenatal care",
  ],
  openGraph: {
    title: "PregnancyPlus - Your Complete Pregnancy Companion",
    description:
      "Track your pregnancy journey, get personalized insights, and connect with a supportive community - all in one beautifully designed app.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PregnancyPlus App",
      },
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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
