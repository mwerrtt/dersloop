"use client";

import { useEffect, useState } from "react";

interface Setting {
  id: string;
  key: string;
  value: string;
}

const LABELS: Record<string, string> = {
  summary_prompt: "Özetleme Promptu",
  video_cards_prompt: "Video Kart Promptu",
  podcast_prompt: "Podcast Promptu",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || []));
  }, []);

  async function save(key: string, value: string) {
    setSaving(key);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Prompt Ayarları</h1>
      <p className="text-white/50 mb-8">AI içerik üretim promptlarını düzenle</p>

      <div className="space-y-6 max-w-3xl">
        {settings.map((setting) => (
          <div key={setting.id} className="glass-card p-6">
            <label className="text-sm font-medium mb-2 block">
              {LABELS[setting.key] || setting.key}
            </label>
            <textarea
              defaultValue={setting.value}
              className="input-field resize-none h-32 mb-3"
              onBlur={(e) => {
                if (e.target.value !== setting.value) {
                  save(setting.key, e.target.value);
                  setting.value = e.target.value;
                }
              }}
            />
            {saving === setting.key && (
              <span className="text-xs text-accent">Kaydediliyor...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
