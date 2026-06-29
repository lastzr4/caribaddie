"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup" | "sent";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/discover");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setMode("sent");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#7F77DD] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            👥
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">CariBuddy</h1>
          <p className="text-sm text-gray-500 mt-1">Cari rakan aktiviti kamu</p>
        </div>

        {mode === "sent" ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">📬</div>
            <p className="font-semibold text-gray-900">Semak emel kamu!</p>
            <p className="text-sm text-gray-500">
              Link pengesahan dihantar ke <span className="font-medium text-gray-700">{email}</span>.
              Klik link tu, lepas tu boleh log masuk.
            </p>
            <button onClick={() => setMode("login")} className="text-sm text-[#7F77DD] underline">
              ← Kembali log masuk
            </button>
          </div>
        ) : (
          <>
            {/* Tab toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${mode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                Log Masuk
              </button>
              <button
                onClick={() => { setMode("signup"); setError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${mode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                Daftar
              </button>
            </div>

            <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Alamat emel"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata laluan"
                minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
                required
              />
              {error && <p className="text-red-500 text-xs px-1">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7F77DD] text-white font-medium py-3 rounded-2xl disabled:opacity-60"
              >
                {loading ? "Tunggu..." : mode === "login" ? "Log Masuk" : "Daftar Sekarang"}
              </button>
            </form>
          </>
        )}

        <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
          Dengan mendaftar, kamu bersetuju dengan{" "}
          <span className="underline">Terma Perkhidmatan</span> dan{" "}
          <span className="underline">Dasar Privasi</span> kami.
        </p>
      </div>
    </div>
  );
}
