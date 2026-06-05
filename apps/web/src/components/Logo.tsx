import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
        DL
      </div>
      <span className={`font-bold ${sizes[size]}`}>
        <span className="neon-text">Ders</span>
        <span className="text-white">Loop</span>
      </span>
    </Link>
  );
}
