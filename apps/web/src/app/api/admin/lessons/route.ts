import { prisma } from "@dersloop/database";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const lessons = await prisma.generatedLesson.findMany({
      include: {
        course: { select: { title: true, userId: true } },
        videoCards: true,
        podcasts: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ lessons });
  } catch {
    return jsonError("Yetkisiz", 403);
  }
}
