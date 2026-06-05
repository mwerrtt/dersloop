"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  Upload,
  Bookmark,
  LogOut,
  Shield,
} from "lucide-react";

interface AppNavProps {
  user: { name: string; role: string };
}

export function AppNav({ user }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/app/dashboard", label: "Panel", icon: LayoutDashboard },
    { href: "/app/upload", label: "Yükle", icon: Upload },
    { href: "/app/saved", label: "Kayıtlı", icon: Bookmark },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 md:top-0 md:bottom-auto">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="hidden md:block">
          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-1 md:flex-none justify-center md:justify-end">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 rounded-xl text-xs md:text-sm transition-all ${
                pathname === href
                  ? "text-primary bg-primary/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 rounded-xl text-xs md:text-sm transition-all ${
                pathname.startsWith("/admin")
                  ? "text-accent bg-accent/10"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Shield size={18} />
              <span>Admin</span>
            </Link>
          )}
          <button
            onClick={logout}
            className="flex flex-col md:flex-row items-center gap-1 px-3 py-2 rounded-xl text-xs md:text-sm text-white/60 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Çıkış</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
