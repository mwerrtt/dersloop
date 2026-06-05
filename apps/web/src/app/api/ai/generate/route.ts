import { prisma } from "@dersloop/database";
import { requireAuth } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";
import { generateLessonContent } from "@/lib/ai/provider";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { courseId } = await parseBody<{ courseId: string }>(request);

    const course = await prisma.course.findFirst({
      where: { id: courseId, userId: session.id },
      include: { uploadedFiles: true },
    });

    if (!course) return jsonError("Ders bulunamadı", 404);

    const text =
      course.uploadedFiles[0]?.extractedText || course.title + " " + (course.description || "");

    await prisma.course.update({
      where: { id: courseId },
      data: { status: "PROCESSING" },
    });

    const aiResult = await generateLessonContent(course.title, text, session.id);

    const lesson = await prisma.generatedLesson.create({
      data: {
        courseId: course.id,
        title: aiResult.lesson_title,
        summary: aiResult.summary,
      },
    });

    await prisma.videoCard.createMany({
      data: aiResult.video_cards.map((card, index) => ({
        lessonId: lesson.id,
        title: card.title,
        content: card.content,
        keyPoint: card.key_point,
        durationSeconds: card.duration_seconds,
        orderIndex: index,
        visualHint: card.visual_hint || "gradient-purple",
      })),
    });

    await prisma.podcast.create({
      data: {
        lessonId: lesson.id,
        title: aiResult.podcast.title,
        script: aiResult.podcast.script,
        durationSeconds: aiResult.podcast.duration_seconds,
      },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { status: "COMPLETED" },
    });

    return jsonOk({ lessonId: lesson.id });
  } catch {
    return jsonError("AI üretimi başarısız", 500);
  }
}
