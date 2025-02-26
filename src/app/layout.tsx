import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MomCare - Support for Your Pregnancy Journey",
  description: "A comprehensive app for pregnant women offering guidance, tracking, and community support throughout your pregnancy journey.",
  keywords: ["pregnancy", "pregnant", "mom", "baby", "health", "tracking", "prenatal care"],
  openGraph: {
    title: "MomCare - Support for Your Pregnancy Journey",
    description: "A comprehensive app for pregnant women offering guidance, tracking, and community support throughout your pregnancy journey.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MomCare App",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
