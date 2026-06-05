import { prisma } from "@dersloop/database";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalFiles,
      totalLessons,
      totalCards,
      totalPodcasts,
      successLogs,
      failedLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.uploadedFile.count(),
      prisma.generatedLesson.count(),
      prisma.videoCard.count(),
      prisma.podcast.count(),
      prisma.aiLog.count({ where: { status: "SUCCESS" } }),
      prisma.aiLog.count({ where: { status: "FAILED" } }),
    ]);

    return jsonOk({
      stats: {
        totalUsers,
        totalFiles,
        totalLessons,
        totalCards,
        totalPodcasts,
        successLogs,
        failedLogs,
      },
    });
  } catch {
    return jsonError("Yetkisiz", 403);
  }
}
