"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  course: { title: string };
  videoCards: { id: string }[];
  podcasts: { id: string }[];
}

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/lessons")
      .then((r) => r.json())
      .then((d) => setLessons(d.lessons || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Oluşturulan İçerikler</h1>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="glass-card p-5">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                setExpanded(expanded === lesson.id ? null : lesson.id)
              }
            >
              <div>
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-white/40 mt-1">
                  {lesson.course.title} · {lesson.videoCards.length} kart ·{" "}
                  {lesson.podcasts.length} podcast
                </p>
              </div>
              <span className="text-xs text-white/30">
                {formatDate(lesson.createdAt)}
              </span>
            </div>
            {expanded === lesson.id && (
              <p className="mt-4 text-sm text-white/60 leading-relaxed border-t border-white/10 pt-4">
                {lesson.summary}
              </p>
            )}
          </div>
        ))}
        {lessons.length === 0 && (
          <div className="glass-card p-8 text-center text-white/40">
            Henüz içerik oluşturulmamış
          </div>
        )}
      </div>
    </div>
  );
}
