"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import { CATEGORIES } from "@dersloop/shared";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Diğer");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      if (!title) setTitle(dropped.name.replace(/\.[^.]+$/, ""));
    }
  }, [title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Yükleme başarısız");
        return;
      }

      router.push(`/app/processing/${data.courseId}?lessonId=${data.lessonId}`);
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Not Yükle</h1>
      <p className="text-white/50 mb-8">
        PDF, DOCX veya PPTX dosyanı yükle, AI kartlar oluştursun.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          animate={{ borderColor: dragging ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)" }}
          className={`glass-card p-12 text-center border-2 border-dashed transition-all cursor-pointer ${
            dragging ? "animate-pulse-glow" : ""
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx,.pptx,.txt,.doc,.ppt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFile(f);
                if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
              }
            }}
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="text-primary" size={32} />
              <div className="text-left">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-white/40">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto text-white/30 mb-4" size={48} />
              <p className="font-medium mb-1">Dosyayı sürükle veya tıkla</p>
              <p className="text-sm text-white/40">PDF, DOCX, PPTX, TXT</p>
            </>
          )}
        </motion.div>

        <div>
          <label className="text-sm text-white/60 mb-1.5 block">Ders Adı</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Örn: Fotosentez Notları"
            required
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1.5 block">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-surface">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1.5 block">
            Açıklama (opsiyonel)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field resize-none h-24"
            placeholder="Kısa bir açıklama..."
          />
        </div>

        <button
          type="submit"
          disabled={!file || !title || loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? "Yükleniyor ve analiz ediliyor..." : "Yükle ve Analiz Et"}
        </button>
      </form>
    </div>
  );
}
