import { prisma } from "@dersloop/database";
import { requireAuth } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireAuth();
    const courses = await prisma.course.findMany({
      where: { userId: session.id },
      include: {
        generatedLessons: { include: { videoCards: true, podcasts: true } },
        uploadedFiles: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ courses });
  } catch {
    return jsonError("Yetkisiz", 401);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { title, description, category } = await parseBody<{
      title: string;
      description?: string;
      category?: string;
    }>(request);

    if (!title) return jsonError("Ders adı gerekli");

    const course = await prisma.course.create({
      data: {
        userId: session.id,
        title,
        description,
        category,
      },
    });

    return jsonOk({ course });
  } catch {
    return jsonError("Ders oluşturulamadı", 500);
  }
}
