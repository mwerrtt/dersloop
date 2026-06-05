import { prisma } from "@dersloop/database";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const logs = await prisma.aiLog.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return jsonOk({ logs });
  } catch {
    return jsonError("Yetkisiz", 403);
  }
}
