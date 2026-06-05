"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Play } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface SavedItem {
  id: string;
  videoCard: {
    id: string;
    title: string;
    content: string;
    keyPoint: string;
    durationSeconds: number;
    lesson: {
      id: string;
      title: string;
      course: { title: string };
    };
  };
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/saved")
      .then((r) => r.json())
      .then((d) => setItems(d.saved || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Kaydedilenler</h1>
      <p className="text-white/50 mb-8">Favori ders kartların</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card p-6 h-24 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Bookmark className="mx-auto text-white/20 mb-4" size={48} />
          <h3 className="text-lg font-semibold mb-2">Henüz kayıtlı kart yok</h3>
          <p className="text-white/50 mb-6">
            Feed ekranında kartları kaydet, burada tekrar çalış.
          </p>
          <Link href="/app/dashboard" className="btn-primary">
            Derslere Git
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 mb-1">
                  {item.videoCard.lesson.course.title}
                </p>
                <h3 className="font-semibold truncate">{item.videoCard.title}</h3>
                <p className="text-sm text-white/50 truncate mt-1">
                  {item.videoCard.keyPoint}
                </p>
                <span className="text-xs text-accent mt-1 inline-block">
                  {formatDuration(item.videoCard.durationSeconds)}
                </span>
              </div>
              <Link
                href={`/app/feed/${item.videoCard.lesson.id}`}
                className="p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all shrink-0"
              >
                <Play size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
