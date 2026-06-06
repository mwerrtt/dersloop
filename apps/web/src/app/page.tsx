"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Play, Zap, Headphones, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "40 Saniyede Öğren",
    desc: "Uzun notları kısa, öz kartlara dönüştür",
  },
  {
    icon: Play,
    title: "Reels Tarzı Akış",
    desc: "Kaydırarak TikTok gibi ders çalış",
  },
  {
    icon: Headphones,
    title: "Podcast Modu",
    desc: "Sesli anlatımla her yerde öğren",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost">
            Giriş
          </Link>
          <Link href="/auth/register" className="btn-primary text-sm">
            Başla
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Notunu yükle,{" "}
            <span className="neon-text">40 saniyede</span> öğren
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-8">
            Ders notların kısa öğrenme akışına dönüşsün. AI ile özet, Reels
            tarzı kartlar ve podcast — hepsi bir arada.
          </p>
          <Link
            href="/auth/register"
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            Hemen Başla
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                <f.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 glass-card p-8 max-w-md mx-auto"
        >
          <div className="aspect-[9/16] max-h-80 mx-auto rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/10 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm text-white/40 mb-2">Örnek Kart</p>
            <h4 className="text-xl font-bold mb-3">Fotosentez</h4>
            <p className="text-sm text-white/70">
              Bitkiler güneş ışığını enerjiye çevirir. Klorofil bu sürecin
              anahtarıdır.
            </p>
            <span className="mt-4 text-xs text-accent font-medium">
              25 saniye
            </span>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 text-center py-8 text-white/30 text-sm">
        DersLoop — Kaydır, öğren, geç.
      </footer>
    </div>
  );
}
