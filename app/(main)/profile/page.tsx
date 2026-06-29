import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Profil Saya</h1>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-[#EEEDFE] flex items-center justify-center text-2xl font-semibold text-[#534AB7]">
          {profile?.display_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-900">{profile?.display_name ?? "—"}</p>
          <p className="text-sm text-gray-500">{profile?.location_area ?? "Lokasi belum ditetapkan"}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Bio</p>
          <p className="text-sm text-gray-800">{profile?.bio ?? "Belum ada bio"}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800">Free</p>
            <button className="text-xs bg-[#7F77DD] text-white px-3 py-1.5 rounded-full">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
