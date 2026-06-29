import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/types";
import { LogoutButton } from "@/components/profile/LogoutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null; error: unknown };

  const initial = profile?.display_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="scroll-area h-full pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profil</h1>
        <Link href="/profile/edit" className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
          Edit
        </Link>
      </div>

      {/* Profile card */}
      <div className="mx-4 mt-3 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        {/* Cover / avatar */}
        <div className="h-28 bg-gradient-to-br from-violet-100 to-purple-200 relative">
          <div className="absolute -bottom-10 left-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-md border-4 border-white" style={{ background: "var(--brand)" }}>
              {initial}
            </div>
          </div>
        </div>

        <div className="pt-14 px-5 pb-5">
          <div className="flex items-end justify-between mb-1">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.display_name ?? "Nama belum ditetapkan"}
              </h2>
              <p className="text-sm text-gray-400">
                📍 {profile?.location_area ?? "Lokasi belum ditetapkan"}
              </p>
            </div>
            {profile?.is_verified && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium border border-green-200">
                ✓ Verified
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            {profile?.bio ?? "Belum ada bio. Tap Edit untuk tambah."}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Aktiviti", value: "0" },
          { label: "Match", value: "0" },
          { label: "Chat", value: "0" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-3 text-center border border-gray-100">
            <p className="text-xl font-bold" style={{ color: "var(--brand)" }}>{s.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Settings list */}
      <div className="mx-4 mt-4 bg-white rounded-3xl border border-gray-100 overflow-hidden">
        {[
          { icon: "🎯", label: "Aktiviti saya", sub: "Urus aktiviti yang kamu cari buddy" },
          { icon: "🔒", label: "Privasi & Keselamatan", sub: "Kawalan siapa yang boleh nampak kamu" },
          { icon: "🔔", label: "Notifikasi", sub: "Urus notifikasi push" },
        ].map((item, i, arr) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <span className="text-xl w-8 text-center">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{item.sub}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>

      {/* Plan card */}
      <div className="mx-4 mt-3 rounded-3xl p-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-dark))" }}>
        <div>
          <p className="text-white font-bold">Plan Free</p>
          <p className="text-orange-100 text-xs mt-0.5">5 swipe/hari · 1 aktiviti</p>
        </div>
        <button className="bg-white text-xs font-bold px-4 py-2 rounded-full" style={{ color: "var(--brand)" }}>
          Upgrade ✨
        </button>
      </div>

      {/* Logout */}
      <div className="mx-4 mt-3">
        <LogoutButton />
      </div>
    </div>
  );
}
