"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Volume2,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface Podcast {
  id: string;
  title: string;
  script: string;
  durationSeconds: number;
}

export default function PodcastPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((d) => {
        setPodcast(d.lesson?.podcasts?.[0] || null);
        setLessonTitle(d.lesson?.title || "");
      });
  }, [lessonId]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speak() {
    if (!podcast || typeof window === "undefined") return;

    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(podcast.script);
    utterance.lang = "tr-TR";
    utterance.rate = 1;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => {
      setPlaying(false);
      setProgress(100);
    };
    utterance.onboundary = (e) => {
      if (podcast.script.length > 0) {
        setProgress((e.charIndex / podcast.script.length) * 100);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  if (!podcast) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse text-white/50">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm"
      >
        <ArrowLeft size={16} />
        Geri
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-6">
            <Volume2 size={48} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-1">{podcast.title}</h1>
          <p className="text-white/50 text-sm">{lessonTitle}</p>
          <span className="inline-block mt-2 text-xs text-accent">
            {formatDuration(podcast.durationSeconds)}
          </span>
        </div>

        <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <button className="p-3 rounded-full hover:bg-white/10 text-white/60">
            <SkipBack size={24} />
          </button>
          <button
            onClick={speak}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
          >
            {playing ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button className="p-3 rounded-full hover:bg-white/10 text-white/60">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="glass p-4 rounded-xl max-h-60 overflow-y-auto">
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {podcast.script}
          </p>
        </div>

        <p className="text-xs text-white/30 text-center mt-4">
          Demo: Tarayıcı ses sentezi kullanılıyor. Gerçek TTS sonraki sürümde.
        </p>
      </motion.div>
    </div>
  );
}
