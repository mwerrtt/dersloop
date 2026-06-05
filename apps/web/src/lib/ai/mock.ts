import type { AiGenerationResult } from "@dersloop/shared";

const MOCK_CARDS = [
  {
    title: "Ana Kavram",
    content:
      "Bu konunun temelinde şu prensip yatar: karmaşık görünen her şey aslında basit parçalardan oluşur. Önce temeli anla, gerisi gelir.",
    key_point: "Temel prensibi kavra",
    duration_seconds: 25,
    visual_hint: "gradient-purple",
  },
  {
    title: "Formül & Uygulama",
    content:
      "Formülü ezberlemek yetmez — nerede kullanılacağını bil. Pratikte bu formül şu durumlarda devreye girer ve sonucu hızla verir.",
    key_point: "Formülü bağlamında öğren",
    duration_seconds: 30,
    visual_hint: "gradient-blue",
  },
  {
    title: "Sık Yapılan Hata",
    content:
      "Öğrencilerin %80'i bu noktada takılıyor: işaret hatası. Çözüm basit — her adımda birim kontrolü yap.",
    key_point: "İşaret hatasına dikkat",
    duration_seconds: 20,
    visual_hint: "gradient-orange",
  },
  {
    title: "Hızlı Tekrar",
    content:
      "Sınav öncesi 30 saniyelik özet: ana kavram + formül + dikkat edilecek nokta. Bunları hatırla, soruyu çözersin.",
    key_point: "3 madde ile tekrar et",
    duration_seconds: 18,
    visual_hint: "gradient-green",
  },
];

export function generateMockContent(
  courseTitle: string,
  extractedText?: string
): AiGenerationResult {
  const snippet = extractedText?.slice(0, 200).trim();
  const context = snippet
    ? `"${snippet}..." içeriğinden`
    : "yüklediğin ders notundan";

  return {
    lesson_title: `${courseTitle} — Öğrenme Akışı`,
    summary: `${context} oluşturulan bu özet, ana kavramları, formülleri ve sınavda çıkabilecek kritik noktaları kapsıyor. Kaydırarak her kartı 15-40 saniyede öğren.`,
    video_cards: MOCK_CARDS.map((card, i) => ({
      ...card,
      title: `${courseTitle}: ${card.title}`,
      duration_seconds: Math.min(40, Math.max(15, card.duration_seconds)),
      order_index: i,
    })) as AiGenerationResult["video_cards"],
    podcast: {
      title: `${courseTitle} Podcast`,
      script: `Merhaba! Bugün ${courseTitle} konusunu birlikte öğreneceğiz.

${snippet ? `Notlarından şunu gördüm: ${snippet.slice(0, 150)}...` : "Yüklediğin notları analiz ettim."}

İlk olarak ana kavramı anlayalım. Bu konu sınavda sık çıkıyor, o yüzden dikkatli dinle.

Formül kısmına geçelim — ezberlemek yetmez, nerede kullanacağını bilmen lazım.

Son olarak en sık yapılan hatayı söyleyeyim: aceleci olma, adım adım git.

Tamam, bu kadar! Kaydırarak kartları da izleyebilirsin. Başarılar!`,
      duration_seconds: 120,
    },
  };
}
