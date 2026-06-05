import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@dersloop/database";
import { requireAuth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { extractText } from "@/lib/extract";
import { generateLessonContent } from "@/lib/ai/provider";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const category = (formData.get("category") as string) || "Diğer";
    const courseId = formData.get("courseId") as string | null;

    if (!file || !title) return jsonError("Dosya ve ders adı gerekli");

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowed = ["pdf", "docx", "pptx", "txt", "doc", "ppt"];
    if (!allowed.includes(ext)) {
      return jsonError("Desteklenen formatlar: PDF, DOCX, PPTX, TXT");
    }

    let course = courseId
      ? await prisma.course.findFirst({
          where: { id: courseId, userId: session.id },
        })
      : null;

    if (!course) {
      course = await prisma.course.create({
        data: {
          userId: session.id,
          title,
          description,
          category,
          status: "PROCESSING",
        },
      });
    } else {
      await prisma.course.update({
        where: { id: course.id },
        data: { status: "PROCESSING", title, description, category },
      });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        courseId: course.id,
        userId: session.id,
        fileName: file.name,
        fileType: ext,
        filePath,
        fileSize: buffer.length,
        status: "EXTRACTING",
      },
    });

    const extractedText = await extractText(filePath, ext);
    const textToUse =
      extractedText ||
      `Ders: ${title}. Kategori: ${category}. ${description}. Bu not için demo içerik üretilecek.`;

    await prisma.uploadedFile.update({
      where: { id: uploadedFile.id },
      data: {
        extractedText: textToUse,
        status: extractedText ? "EXTRACTED" : "EXTRACTED",
      },
    });

    const aiResult = await generateLessonContent(title, textToUse, session.id);

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
      where: { id: course.id },
      data: { status: "COMPLETED" },
    });

    return jsonOk({
      courseId: course.id,
      lessonId: lesson.id,
      fileId: uploadedFile.id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return jsonError("Yükleme başarısız", 500);
  }
}
