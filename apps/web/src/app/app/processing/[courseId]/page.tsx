"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PROCESSING_STEPS } from "@dersloop/shared";
import { Check } from "lucide-react";

export default function ProcessingPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= PROCESSING_STEPS.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 1200);

    const timeout = setTimeout(() => {
      if (lessonId) {
        router.push(`/app/feed/${lessonId}`);
      } else {
        fetch(`/api/courses/${courseId}`)
          .then((r) => r.json())
          .then((d) => {
            const lesson = d.course?.generatedLessons?.[0];
            if (lesson) router.push(`/app/feed/${lesson.id}`);
            else router.push("/app/dashboard");
          });
      }
    }, PROCESSING_STEPS.length * 1200 + 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [courseId, lessonId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        className="relative w-32 h-32 mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
        <div className="absolute inset-2 rounded-full border-2 border-secondary/40 border-t-transparent" />
        <div className="absolute inset-4 rounded-full border-2 border-accent/50 border-b-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold neon-text">AI</span>
        </div>
      </motion.div>

      <h1 className="text-2xl font-bold mb-2">Notların analiz ediliyor</h1>
      <p className="text-white/50 mb-8">Kısa ders kartların hazırlanıyor...</p>

      <div className="w-full max-w-md space-y-3">
        {PROCESSING_STEPS.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              i <= currentStep ? "glass-card" : "opacity-30"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i < currentStep
                  ? "bg-accent text-black"
                  : i === currentStep
                    ? "bg-primary animate-pulse"
                    : "bg-white/10"
              }`}
            >
              {i < currentStep ? <Check size={14} /> : i + 1}
            </div>
            <span className="text-sm">{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
