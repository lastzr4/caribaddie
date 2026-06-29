"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

const AREAS = [
  "Kuala Lumpur", "Petaling Jaya", "Subang Jaya", "Shah Alam",
  "Cheras", "Ampang", "Bangsar", "Mont Kiara", "Kepong",
  "Klang", "Cyberjaya", "Putrajaya",
];

export default function EditProfilePage() {
  const [displayName, setDisplayName]     = useState("");
  const [bio, setBio]                     = useState("");
  const [location, setLocation]           = useState("");
  const [gender, setGender]               = useState<"male" | "female" | "">("");
  const [preferredGender, setPreferredGender] = useState<"male" | "female" | "any">("any");
  const [hasGps, setHasGps]               = useState(false);
  const [gpsStatus, setGpsStatus]         = useState<"idle" | "loading" | "ok" | "denied">("idle");
  const [coords, setCoords]               = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [success, setSuccess]             = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single() as { data: Profile | null; error: unknown };

      if (data) {
        setDisplayName(data.display_name ?? "");
        setBio(data.bio ?? "");
        setLocation(data.location_area ?? "");
        setGender((data.gender as "male" | "female") ?? "");
        setPreferredGender((data.preferred_gender as "male" | "female" | "any") ?? "any");
        if (data.lat && data.lng) {
          setHasGps(true);
          setCoords({ lat: data.lat, lng: data.lng });
          setGpsStatus("ok");
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const requestGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setHasGps(true);
        setGpsStatus("ok");
      },
      () => {
        setGpsStatus("denied");
        setHasGps(false);
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const removeGps = () => {
    setHasGps(false);
    setCoords(null);
    setGpsStatus("idle");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any).update({
      display_name: displayName,
      bio,
      location_area: location,
      gender: gender || null,
      preferred_gender: preferredGender,
      lat: hasGps && coords ? coords.lat : null,
      lng: hasGps && coords ? coords.lng : null,
    }).eq("id", user.id);

    setSaving(false);
    setSuccess(true);
    setTimeout(() => router.push("/profile"), 1000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }} />
    </div>
  );

  return (
    <div className="scroll-area h-full px-5 pt-5 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Edit Profil</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Display name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nama Paparan</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Nama kamu"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cerita sikit tentang kamu dan aktiviti yang kamu suka..."
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/200</p>
        </div>

        {/* Kawasan */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kawasan</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm appearance-none"
          >
            <option value="">Pilih kawasan</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1.5">Digunakan bila GPS tidak aktif</p>
        </div>

        {/* GPS toggle */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📡</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Lokasi Tepat (GPS)</p>
                <p className="text-xs text-gray-400">Cari buddy dalam radius tertentu</p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              onClick={hasGps ? removeGps : requestGps}
              disabled={gpsStatus === "loading"}
              className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              style={{ background: hasGps ? "var(--brand)" : "#D1D5DB" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                style={{ transform: hasGps ? "translateX(24px)" : "translateX(0)" }}
              />
            </button>
          </div>

          {/* Status row */}
          {gpsStatus !== "idle" && (
            <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-2">
              {gpsStatus === "loading" && (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }} />
                  <span className="text-xs text-gray-500">Mendapatkan lokasi...</span>
                </>
              )}
              {gpsStatus === "ok" && coords && (
                <>
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-xs text-gray-600">
                    Lokasi disimpan — {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </span>
                  <button
                    type="button"
                    onClick={removeGps}
                    className="ml-auto text-xs text-red-400 underline"
                  >
                    Buang
                  </button>
                </>
              )}
              {gpsStatus === "denied" && (
                <>
                  <span className="text-red-500 text-sm">✕</span>
                  <span className="text-xs text-red-500">
                    Kebenaran ditolak. Aktifkan lokasi dalam tetapan browser.
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Jantina */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Jantina saya</label>
          <div className="flex gap-3">
            {(["female", "male"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                style={gender === g
                  ? { background: "var(--brand)", color: "white", borderColor: "var(--brand)" }
                  : { background: "transparent", color: "#6B7280", borderColor: "#E5E7EB" }}
              >
                {g === "female" ? "Perempuan" : "Lelaki"}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred gender */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nak cari buddy</label>
          <div className="flex gap-2">
            {([["female", "Perempuan"], ["male", "Lelaki"], ["any", "Semua"]] as const).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setPreferredGender(val)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                style={preferredGender === val
                  ? { background: "var(--brand)", color: "white", borderColor: "var(--brand)" }
                  : { background: "transparent", color: "#6B7280", borderColor: "#E5E7EB" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={saving || success}
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm mt-2 transition-all"
          style={{ background: success ? "var(--success)" : "var(--brand)" }}
        >
          {success ? "✓ Tersimpan!" : saving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}
