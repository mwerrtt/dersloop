"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Log {
  id: string;
  action: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
  user: { name: string; email: string } | null;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((r) => r.json())
      .then((d) => setLogs(d.logs || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">AI İşlem Logları</h1>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="glass-card p-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    log.status === "SUCCESS"
                      ? "bg-accent/20 text-accent"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {log.status}
                </span>
                <span className="text-sm font-medium">{log.action}</span>
              </div>
              {log.user && (
                <p className="text-xs text-white/40">{log.user.email}</p>
              )}
              {log.errorMessage && (
                <p className="text-xs text-red-400/80 mt-1">{log.errorMessage}</p>
              )}
            </div>
            <span className="text-xs text-white/30 shrink-0">
              {formatDate(log.createdAt)}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="glass-card p-8 text-center text-white/40">
            Henüz log kaydı yok
          </div>
        )}
      </div>
    </div>
  );
}
