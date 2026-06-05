import { prisma } from "@dersloop/database";
import {
  createToken,
  getUserByEmail,
  hashPassword,
  setAuthCookie,
} from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await parseBody<{
      name: string;
      email: string;
      password: string;
    }>(request);

    if (!name || !email || !password) {
      return jsonError("Tüm alanlar zorunlu");
    }

    if (password.length < 6) {
      return jsonError("Şifre en az 6 karakter olmalı");
    }

    const existing = await getUserByEmail(email);
    if (existing) return jsonError("Bu email zaten kayıtlı");

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    return jsonOk({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return jsonError("Kayıt başarısız", 500);
  }
}
