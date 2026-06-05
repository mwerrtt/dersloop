import { prisma } from "@dersloop/database";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const files = await prisma.uploadedFile.findMany({
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ files });
  } catch {
    return jsonError("Yetkisiz", 403);
  }
}
