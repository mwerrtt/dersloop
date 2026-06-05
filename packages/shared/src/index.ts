export interface VideoCardOutput {
  title: string;
  content: string;
  key_point: string;
  duration_seconds: number;
  visual_hint?: string;
}

export interface AiGenerationResult {
  lesson_title: string;
  summary: string;
  video_cards: VideoCardOutput[];
  podcast: {
    title: string;
    script: string;
    duration_seconds: number;
  };
}

export const CATEGORIES = [
  "Matematik",
  "Fizik",
  "Kimya",
  "Biyoloji",
  "Tarih",
  "Coğrafya",
  "Edebiyat",
  "İngilizce",
  "Bilgisayar",
  "Diğer",
] as const;

export const PROCESSING_STEPS = [
  "Dosya okunuyor",
  "Ders notları analiz ediliyor",
  "Konular ayrılıyor",
  "Kısa video kartları oluşturuluyor",
  "Podcast metni hazırlanıyor",
] as const;
