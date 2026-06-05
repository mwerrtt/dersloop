"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []));
  }, []);

  async function toggleActive(userId: string, isActive: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isActive: !isActive }),
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !isActive } : u))
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Kullanıcı Yönetimi</h1>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-left p-4">Ad</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Rol</th>
                <th className="text-left p-4">Durum</th>
                <th className="text-left p-4">Kayıt</th>
                <th className="text-left p-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-white/70">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "ADMIN"
                          ? "bg-accent/20 text-accent"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive
                          ? "bg-accent/20 text-accent"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="p-4 text-white/40">{formatDate(user.createdAt)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(user.id, user.isActive)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      {user.isActive ? "Pasif Yap" : "Aktif Yap"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
