"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full py-3.5 rounded-2xl border border-red-100 text-red-500 text-sm font-medium bg-red-50 disabled:opacity-60"
    >
      {loading ? "Keluar..." : "Log Keluar"}
    </button>
  );
}
