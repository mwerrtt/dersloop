import {
  createToken,
  getUserByEmail,
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { email, password } = await parseBody<{
      email: string;
      password: string;
    }>(request);

    if (!email || !password) return jsonError("Email ve şifre gerekli");

    const user = await getUserByEmail(email);
    if (!user || !user.isActive) return jsonError("Geçersiz giriş bilgileri");

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return jsonError("Geçersiz giriş bilgileri");

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
    return jsonError("Giriş başarısız", 500);
  }
}
