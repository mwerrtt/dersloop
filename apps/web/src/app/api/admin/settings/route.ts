import { prisma } from "@dersloop/database";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.setting.findMany();
    return jsonOk({ settings });
  } catch {
    return jsonError("Yetkisiz", 403);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const { key, value } = await parseBody<{ key: string; value: string }>(request);

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return jsonOk({ setting });
  } catch {
    return jsonError("Güncellenemedi", 500);
  }
}
