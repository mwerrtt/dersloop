"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  BookOpen,
  Layers,
  Headphones,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalFiles: number;
  totalLessons: number;
  totalCards: number;
  totalPodcasts: number;
  successLogs: number;
  failedLogs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats));
  }, []);

  const cards = stats
    ? [
        { label: "Kullanıcılar", value: stats.totalUsers, icon: Users, color: "text-primary" },
        { label: "Dosyalar", value: stats.totalFiles, icon: FileText, color: "text-secondary" },
        { label: "Dersler", value: stats.totalLessons, icon: BookOpen, color: "text-accent" },
        { label: "Video Kartları", value: stats.totalCards, icon: Layers, color: "text-primary" },
        { label: "Podcastler", value: stats.totalPodcasts, icon: Headphones, color: "text-secondary" },
        { label: "Başarılı AI", value: stats.successLogs, icon: CheckCircle, color: "text-accent" },
        { label: "Hatalı AI", value: stats.failedLogs, icon: XCircle, color: "text-warning" },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-white/50 mb-8">Sistem genel bakış</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!stats
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="glass-card p-6 h-28 animate-pulse" />
            ))
          : cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <card.icon className={card.color} size={24} />
                  <span className="text-3xl font-bold">{card.value}</span>
                </div>
                <p className="text-sm text-white/50">{card.label}</p>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
