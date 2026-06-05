import { prisma } from "@dersloop/database";
import { requireAuth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const lesson = await prisma.generatedLesson.findFirst({
      where: {
        id,
        course: { userId: session.id },
      },
      include: {
        videoCards: { orderBy: { orderIndex: "asc" } },
        podcasts: true,
        course: true,
      },
    });

    if (!lesson) return jsonError("Ders bulunamadı", 404);
    return jsonOk({ lesson });
  } catch {
    return jsonError("Yetkisiz", 401);
  }
}
