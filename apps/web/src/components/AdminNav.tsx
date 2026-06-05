"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  ScrollText,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Kullanıcılar", icon: Users },
    { href: "/admin/files", label: "Dosyalar", icon: FileText },
    { href: "/admin/lessons", label: "İçerikler", icon: BookOpen },
    { href: "/admin/logs", label: "AI Logları", icon: ScrollText },
    { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 hidden md:flex flex-col p-4 z-50">
      <Logo size="sm" />
      <p className="text-xs text-white/40 mt-1 mb-6">Admin Panel</p>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              pathname === href
                ? "bg-primary/20 text-primary"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/app/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft size={18} />
          Uygulamaya Dön
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 w-full"
        >
          <LogOut size={18} />
          Çıkış
        </button>
      </div>
    </aside>
  );
}
