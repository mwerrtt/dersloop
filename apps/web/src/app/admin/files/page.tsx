"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface File {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  course: { title: string };
}

export default function AdminFilesPage() {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetch("/api/admin/files")
      .then((r) => r.json())
      .then((d) => setFiles(d.files || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Yüklenen Dosyalar</h1>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-left p-4">Dosya</th>
                <th className="text-left p-4">Kullanıcı</th>
                <th className="text-left p-4">Ders</th>
                <th className="text-left p-4">Tip</th>
                <th className="text-left p-4">Durum</th>
                <th className="text-left p-4">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-medium">{file.fileName}</td>
                  <td className="p-4 text-white/70">{file.user.email}</td>
                  <td className="p-4">{file.course.title}</td>
                  <td className="p-4 uppercase text-white/40">{file.fileType}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-accent/20 text-accent">
                      {file.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/40">{formatDate(file.createdAt)}</td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40">
                    Henüz dosya yüklenmemiş
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
