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

    const course = await prisma.course.findFirst({
      where: { id, userId: session.id },
      include: {
        uploadedFiles: true,
        generatedLessons: {
          include: { videoCards: { orderBy: { orderIndex: "asc" } }, podcasts: true },
        },
      },
    });

    if (!course) return jsonError("Ders bulunamadı", 404);
    return jsonOk({ course });
  } catch {
    return jsonError("Yetkisiz", 401);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const course = await prisma.course.findFirst({
      where: { id, userId: session.id },
    });
    if (!course) return jsonError("Ders bulunamadı", 404);

    await prisma.course.delete({ where: { id } });
    return jsonOk({ success: true });
  } catch {
    return jsonError("Silinemedi", 500);
  }
}
