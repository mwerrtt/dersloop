import { prisma } from "@dersloop/database";
import { requireAuth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireAuth();
    const saved = await prisma.savedCard.findMany({
      where: { userId: session.id },
      include: {
        videoCard: {
          include: {
            lesson: { include: { course: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ saved });
  } catch {
    return jsonError("Yetkisiz", 401);
  }
}
