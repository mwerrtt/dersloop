"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Bookmark,
  Headphones,
  ChevronUp,
  Share2,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface VideoCard {
  id: string;
  title: string;
  content: string;
  keyPoint: string;
  durationSeconds: number;
  orderIndex: number;
  visualHint: string | null;
}

const GRADIENTS: Record<string, string> = {
  "gradient-purple": "from-primary/40 via-purple-900/30 to-background",
  "gradient-blue": "from-secondary/40 via-blue-900/30 to-background",
  "gradient-orange": "from-warning/40 via-orange-900/30 to-background",
  "gradient-green": "from-accent/40 via-green-900/30 to-background",
};

export default function FeedPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [cards, setCards] = useState<VideoCard[]>([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((d) => {
        setCards(d.lesson?.videoCards || []);
        setLessonTitle(d.lesson?.title || "");
      });
  }, [lessonId]);

  function goTo(index: number) {
    if (index < 0 || index >= cards.length) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y < -80) goTo(currentIndex + 1);
    else if (info.offset.y > 80) goTo(currentIndex - 1);
  }

  async function toggleSave(cardId: string) {
    const isSaved = saved.has(cardId);
    const method = isSaved ? "DELETE" : "POST";
    await fetch(`/api/cards/${cardId}/save`, { method });
    setSaved((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  const card = cards[currentIndex];
  if (!card) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse text-white/50">Yükleniyor...</div>
      </div>
    );
  }

  const gradient = GRADIENTS[card.visualHint || "gradient-purple"] || GRADIENTS["gradient-purple"];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 bg-background md:relative md:inset-auto md:min-h-[80vh] md:rounded-2xl md:overflow-hidden"
    >
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between md:top-6 md:left-6 md:right-6">
        <button
          onClick={() => router.push("/app/dashboard")}
          className="text-sm text-white/60 hover:text-white"
        >
          ← Panel
        </button>
        <span className="text-sm text-white/40">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={card.id}
          custom={direction}
          initial={{ y: direction > 0 ? 300 : -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction > 0 ? -300 : 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className={`absolute inset-0 bg-gradient-to-b ${gradient} flex flex-col justify-center p-8 md:p-12`}
        >
          <div className="max-w-lg mx-auto w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-accent mb-4">
              {formatDuration(card.durationSeconds)}
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {card.title}
            </h2>

            <p className="text-lg text-white/80 leading-relaxed mb-6">
              {card.content}
            </p>

            <div className="glass-card p-4 border-l-4 border-l-accent">
              <p className="text-sm text-white/50 mb-1">Önemli Nokta</p>
              <p className="font-medium text-accent">{card.keyPoint}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-4 bottom-32 md:right-8 flex flex-col gap-4 z-50">
        <button
          onClick={() => toggleSave(card.id)}
          className={`w-12 h-12 rounded-full glass flex items-center justify-center transition-all ${
            saved.has(card.id) ? "text-accent bg-accent/20" : "text-white/70"
          }`}
        >
          <Bookmark size={20} fill={saved.has(card.id) ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => router.push(`/app/podcast/${lessonId}`)}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-secondary"
        >
          <Headphones size={20} />
        </button>
        <button className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70">
          <Share2 size={20} />
        </button>
      </div>

      {currentIndex < cards.length - 1 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/30 z-50"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronUp size={20} className="rotate-180" />
          <span className="text-xs mt-1">Kaydır</span>
        </motion.div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/30 z-50 hidden md:block">
        {lessonTitle}
      </div>
    </div>
  );
}
