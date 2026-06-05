import { prisma } from "@dersloop/database";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ users });
  } catch {
    return jsonError("Yetkisiz", 403);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const { userId, isActive } = await parseBody<{
      userId: string;
      isActive: boolean;
    }>(request);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return jsonOk({ user: { id: user.id, isActive: user.isActive } });
  } catch {
    return jsonError("Güncellenemedi", 500);
  }
}
