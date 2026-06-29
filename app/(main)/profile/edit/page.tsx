"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

const AREAS = ["Kuala Lumpur", "Petaling Jaya", "Subang Jaya", "Shah Alam", "Cheras", "Ampang", "Bangsar", "Mont Kiara", "Kepong", "Klang", "Cyberjaya", "Putrajaya"];

export default function EditProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [preferredGender, setPreferredGender] = useState<"male" | "female" | "any">("any");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single() as { data: Profile | null; error: unknown };
      if (data) {
        setDisplayName(data.display_name ?? "");
        setBio(data.bio ?? "");
        setLocation(data.location_area ?? "");
        setGender((data.gender as "male" | "female") ?? "");
        setPreferredGender((data.preferred_gender as "male" | "female" | "any") ?? "any");
      }
      setLoading(false);
    };
    load();
  }, []);

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
    }).eq("id", user.id);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => { router.push("/profile"); }, 1000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }} />
    </div>
  );

  return (
    <div className="scroll-area h-full px-5 pt-5 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Edit Profil</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
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
        </div>

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
