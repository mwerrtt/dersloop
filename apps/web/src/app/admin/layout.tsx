import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (session.role !== "ADMIN") redirect("/app/dashboard");

  return (
    <div className="min-h-screen md:pl-64">
      <AdminNav />
      <main className="p-6 max-w-6xl">{children}</main>
    </div>
  );
}
