import { prisma } from "@dersloop/database";
import { requireAuth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const card = await prisma.videoCard.findFirst({
      where: {
        id,
        lesson: { course: { userId: session.id } },
      },
    });
    if (!card) return jsonError("Kart bulunamadı", 404);

    await prisma.savedCard.upsert({
      where: {
        userId_videoCardId: { userId: session.id, videoCardId: id },
      },
      update: {},
      create: { userId: session.id, videoCardId: id },
    });

    return jsonOk({ saved: true });
  } catch {
    return jsonError("Kaydedilemedi", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    await prisma.savedCard.deleteMany({
      where: { userId: session.id, videoCardId: id },
    });

    return jsonOk({ saved: false });
  } catch {
    return jsonError("Silinemedi", 500);
  }
}
