import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DersLoop — Kaydır, öğren, geç.",
  description:
    "Ders notlarını 40 saniyelik öğrenme akışına dönüştür. AI destekli Reels tarzı ders kartları.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DersLoop",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased bg-transparent`}>
        <InteractiveBackground />
        <div className="relative z-[1] min-h-screen">{children}</div>
      </body>
    </html>
  );
}
