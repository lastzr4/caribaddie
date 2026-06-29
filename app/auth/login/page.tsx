"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "sent">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep("sent");
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

        {step === "email" ? (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Alamat emel
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7F77DD] text-white font-medium py-3 rounded-2xl disabled:opacity-60"
            >
              {loading ? "Menghantar..." : "Hantar Magic Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-5xl">📬</div>
            <div>
              <p className="font-semibold text-gray-900">Semak emel kamu!</p>
              <p className="text-sm text-gray-500 mt-1">
                Link log masuk dihantar ke{" "}
                <span className="font-medium text-gray-700">{email}</span>
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Klik link dalam emel untuk masuk. Boleh tutup tab ini.
            </p>
            <button
              onClick={() => { setStep("email"); setEmail(""); }}
              className="text-sm text-[#7F77DD] underline"
            >
              Guna emel lain
            </button>
          </div>
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
