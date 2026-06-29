"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "lastzr4@gmail.com";

const PRESET_COLORS = [
  { label: "Brick Orange", value: "#C4622D" },
  { label: "Deep Purple", value: "#7F77DD" },
  { label: "Emerald", value: "#059669" },
  { label: "Rose", value: "#E11D48" },
  { label: "Midnight Blue", value: "#1D4ED8" },
  { label: "Amber", value: "#D97706" },
  { label: "Slate", value: "#475569" },
  { label: "Teal", value: "#0D9488" },
];

const FONT_OPTIONS = [
  { label: "Geist (Default)", value: "geist" },
  { label: "Inter", value: "inter" },
  { label: "Poppins", value: "poppins" },
];

type Config = {
  appName: string;
  logoEmoji: string;
  tagline: string;
  primaryColor: string;
  fontFamily: string;
};

export default function AdminPage() {
  const [config, setConfig] = useState<Config>({
    appName: "CariBuddy",
    logoEmoji: "👥",
    tagline: "Cari rakan aktiviti kamu",
    primaryColor: "#C4622D",
    fontFamily: "geist",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("app_config").select("key, value");
      if (data) {
        const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
        setConfig((prev) => ({ ...prev, ...map }));
      }
      // Apply current theme live
      if (data) {
        const colorRow = data.find((r: { key: string }) => r.key === "primaryColor");
        if (colorRow) document.documentElement.style.setProperty("--brand", colorRow.value);
      }
      setLoading(false);
    };
    init();
  }, []);

  const applyPreview = (color: string) => {
    document.documentElement.style.setProperty("--brand", color);
    setConfig((prev) => ({ ...prev, primaryColor: color }));
  };

  const handleSave = async () => {
    setSaving(true);
    const entries = Object.entries(config).map(([key, value]) => ({ key, value }));
    for (const entry of entries) {
      await supabase.from("app_config").upsert(entry, { onConflict: "key" });
    }
    // Apply to CSS
    document.documentElement.style.setProperty("--brand", config.primaryColor);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }} />
    </div>
  );

  if (unauthorized) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-8 text-center">
      <span className="text-5xl">🔒</span>
      <p className="font-bold text-gray-900">Akses Ditolak</p>
      <p className="text-sm text-gray-500">Halaman ini hanya untuk admin.</p>
      <button onClick={() => router.push("/discover")} className="text-sm underline" style={{ color: "var(--brand)" }}>Kembali ke apps</button>
    </div>
  );

  return (
    <div className="scroll-area h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/discover")} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <h1 className="font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-400">Tetapan aplikasi</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all"
          style={{ background: saved ? "var(--success)" : "var(--brand)" }}
        >
          {saved ? "✓ Tersimpan" : saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="p-5 space-y-5 max-w-lg mx-auto">

        {/* App Identity */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Identiti Aplikasi</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Nama Aplikasi</label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => setConfig((p) => ({ ...p, appName: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Logo (Emoji)</label>
              <div className="flex gap-2 flex-wrap">
                {["👥", "🏃", "💪", "🌟", "🤝", "🎯", "⚡", "🔥"].map((e) => (
                  <button
                    key={e}
                    onClick={() => setConfig((p) => ({ ...p, logoEmoji: e }))}
                    className="w-11 h-11 rounded-xl text-2xl flex items-center justify-center border-2 transition-all"
                    style={config.logoEmoji === e ? { borderColor: "var(--brand)", background: "var(--brand-light)" } : { borderColor: "#E5E7EB", background: "white" }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </section>

        {/* Theme Color */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Warna Tema</h2>

          {/* Live preview */}
          <div className="rounded-xl p-4 mb-4 flex items-center gap-3" style={{ background: "var(--brand)" }}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">{config.logoEmoji}</div>
            <div>
              <p className="text-white font-bold text-sm">{config.appName}</p>
              <p className="text-white/70 text-xs">{config.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => applyPreview(c.value)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-12 h-12 rounded-xl border-2 transition-all"
                  style={{
                    background: c.value,
                    borderColor: config.primaryColor === c.value ? "#1a1a1a" : "transparent",
                    transform: config.primaryColor === c.value ? "scale(1.1)" : "scale(1)",
                  }}
                />
                <span className="text-[9px] text-gray-500 text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Atau masuk warna hex custom</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => applyPreview(e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => applyPreview(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                placeholder="#C4622D"
              />
            </div>
          </div>
        </section>

        {/* Font */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Font</h2>
          <div className="space-y-2">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => setConfig((p) => ({ ...p, fontFamily: f.value }))}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left"
                style={config.fontFamily === f.value
                  ? { borderColor: "var(--brand)", background: "var(--brand-light)" }
                  : { borderColor: "#E5E7EB", background: "white" }}
              >
                <span className="text-sm font-medium text-gray-800">{f.label}</span>
                {config.fontFamily === f.value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "var(--brand)" }}><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
          <h2 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wide">Zon Bahaya</h2>
          <button className="w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium bg-red-50">
            Reset ke tetapan asal
          </button>
        </section>

      </div>
    </div>
  );
}
