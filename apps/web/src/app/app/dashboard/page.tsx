"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Play, Headphones, BookOpen, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  category: string | null;
  status: string;
  createdAt: string;
  generatedLessons: {
    id: string;
    title: string;
    videoCards: { id: string }[];
    podcasts: { id: string }[];
  }[];
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Panel</h1>
          <p className="text-white/50 mt-1">Derslerin ve içeriklerin</p>
        </div>
        <Link href="/app/upload" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          Yeni Not
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-40 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <BookOpen className="mx-auto text-white/20 mb-4" size={48} />
          <h3 className="text-lg font-semibold mb-2">Henüz ders yok</h3>
          <p className="text-white/50 mb-6">
            İlk ders notunu yükle, AI senin için kartlar oluştursun.
          </p>
          <Link href="/app/upload" className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Not Yükle
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => {
            const lesson = course.generatedLessons[0];
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      course.status === "COMPLETED"
                        ? "bg-accent/20 text-accent"
                        : course.status === "PROCESSING"
                          ? "bg-warning/20 text-warning"
                          : "bg-white/10 text-white/50"
                    }`}
                  >
                    {course.status === "COMPLETED"
                      ? "Hazır"
                      : course.status === "PROCESSING"
                        ? "İşleniyor"
                        : "Taslak"}
                  </span>
                </div>

                {course.category && (
                  <span className="text-xs text-white/40">{course.category}</span>
                )}

                <div className="flex items-center gap-2 text-xs text-white/40 mt-3">
                  <Clock size={12} />
                  {formatDate(course.createdAt)}
                </div>

                {lesson && course.status === "COMPLETED" && (
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/app/feed/${lesson.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/20 text-primary text-sm hover:bg-primary/30 transition-all"
                    >
                      <Play size={14} />
                      İzle
                    </Link>
                    <Link
                      href={`/app/podcast/${lesson.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-secondary/20 text-secondary text-sm hover:bg-secondary/30 transition-all"
                    >
                      <Headphones size={14} />
                      Podcast
                    </Link>
                  </div>
                )}

                {course.status === "PROCESSING" && (
                  <Link
                    href={`/app/processing/${course.id}`}
                    className="block mt-4 text-center py-2 rounded-xl bg-warning/20 text-warning text-sm"
                  >
                    İşleniyor...
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
