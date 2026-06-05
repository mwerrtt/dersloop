import { prisma } from "@dersloop/database";
import type { AiGenerationResult } from "@dersloop/shared";
import { generateMockContent } from "./mock";

async function getPrompt(key: string): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value || "";
}

async function callOpenAI(
  systemPrompt: string,
  userContent: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

function validateAndNormalize(
  raw: unknown,
  courseTitle: string
): AiGenerationResult | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  if (!data.lesson_title || !data.summary || !Array.isArray(data.video_cards)) {
    return null;
  }

  const cards = (data.video_cards as Record<string, unknown>[]).map(
    (card, i) => ({
      title: String(card.title || `Kart ${i + 1}`),
      content: String(card.content || ""),
      key_point: String(card.key_point || card.keyPoint || "Önemli nokta"),
      duration_seconds: Math.min(
        40,
        Math.max(15, Number(card.duration_seconds || card.durationSeconds || 25))
      ),
      visual_hint: String(card.visual_hint || card.visualHint || "gradient-purple"),
    })
  );

  const podcast = (data.podcast as Record<string, unknown>) || {};

  return {
    lesson_title: String(data.lesson_title || courseTitle),
    summary: String(data.summary),
    video_cards: cards,
    podcast: {
      title: String(podcast.title || `${courseTitle} Podcast`),
      script: String(podcast.script || ""),
      duration_seconds: Number(podcast.duration_seconds || 120),
    },
  };
}

export async function generateLessonContent(
  courseTitle: string,
  extractedText: string,
  userId?: string
): Promise<AiGenerationResult> {
  const provider = process.env.AI_PROVIDER || "mock";

  if (provider === "mock" || !extractedText) {
    await logAi(userId, "generate_lesson", "SUCCESS", null, "mock");
    return generateMockContent(courseTitle, extractedText);
  }

  const summaryPrompt = await getPrompt("summary_prompt");
  const cardsPrompt = await getPrompt("video_cards_prompt");
  const podcastPrompt = await getPrompt("podcast_prompt");

  const systemPrompt = `Sen DersLoop AI asistanısın. Ders notlarından öğrenme içeriği üret.
${summaryPrompt}
${cardsPrompt}
${podcastPrompt}

JSON formatında döndür:
{
  "lesson_title": "string",
  "summary": "string",
  "video_cards": [{"title":"string","content":"string","key_point":"string","duration_seconds":15-40,"visual_hint":"string"}],
  "podcast": {"title":"string","script":"string","duration_seconds":number}
}`;

  const aiResponse = await callOpenAI(systemPrompt, extractedText);

  if (aiResponse) {
    try {
      const parsed = JSON.parse(aiResponse);
      const normalized = validateAndNormalize(parsed, courseTitle);
      if (normalized) {
        await logAi(userId, "generate_lesson", "SUCCESS", null, "openai");
        return normalized;
      }
    } catch {
      // fall through to mock
    }
  }

  await logAi(
    userId,
    "generate_lesson",
    "FAILED",
    "AI provider failed, using mock fallback",
    provider
  );
  return generateMockContent(courseTitle, extractedText);
}

async function logAi(
  userId: string | undefined,
  action: string,
  status: "SUCCESS" | "FAILED",
  errorMessage: string | null,
  provider: string
) {
  await prisma.aiLog.create({
    data: {
      userId: userId || null,
      action: `${action}:${provider}`,
      status,
      errorMessage,
    },
  });
}
