"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Activity = {
  id: string;
  name: string;
  name_ms: string;
  icon: string;
  category: string;
};

type UserActivity = {
  activity_id: string;
  skill_level: "beginner" | "intermediate" | "advanced";
  schedule_note: string;
  is_active: boolean;
};

const SKILL_LABELS = {
  beginner: "Pemula",
  intermediate: "Pertengahan",
  advanced: "Mahir",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userActivities, setUserActivities] = useState<Record<string, UserActivity>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);

      // Load all activities
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: acts } = await (supabase as any)
        .from("activities").select("*").order("name");
      setActivities(acts ?? []);

      // Load user's activities
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: ua } = await (supabase as any)
        .from("user_activities")
        .select("activity_id, skill_level, schedule_note, is_active")
        .eq("user_id", user.id);

      const map: Record<string, UserActivity> = {};
      (ua ?? []).forEach((row: UserActivity) => { map[row.activity_id] = row; });
      setUserActivities(map);
      setLoading(false);
    };
    load();
  }, []);

  const toggleActivity = async (activityId: string) => {
    if (!userId) return;
    setSaving(activityId);

    const existing = userActivities[activityId];

    if (existing) {
      // Toggle is_active
      const newActive = !existing.is_active;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("user_activities")
        .update({ is_active: newActive })
        .eq("user_id", userId)
        .eq("activity_id", activityId);

      setUserActivities((prev) => ({
        ...prev,
        [activityId]: { ...existing, is_active: newActive },
      }));
    } else {
      // Insert new
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("user_activities").insert({
        user_id: userId,
        activity_id: activityId,
        skill_level: "beginner",
        schedule_note: "",
        is_active: true,
      });

      setUserActivities((prev) => ({
        ...prev,
        [activityId]: { activity_id: activityId, skill_level: "beginner", schedule_note: "", is_active: true },
      }));
    }

    setSaving(null);
  };

  const updateSkill = async (activityId: string, skill: "beginner" | "intermediate" | "advanced") => {
    if (!userId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("user_activities")
      .update({ skill_level: skill })
      .eq("user_id", userId)
      .eq("activity_id", activityId);

    setUserActivities((prev) => ({
      ...prev,
      [activityId]: { ...prev[activityId], skill_level: skill },
    }));
  };

  const updateSchedule = async (activityId: string, note: string) => {
    if (!userId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("user_activities")
      .update({ schedule_note: note })
      .eq("user_id", userId)
      .eq("activity_id", activityId);

    setUserActivities((prev) => ({
      ...prev,
      [activityId]: { ...prev[activityId], schedule_note: note },
    }));
  };

  const activeCount = Object.values(userActivities).filter((ua) => ua.is_active).length;

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
        style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }} />
    </div>
  );

  return (
    <div className="scroll-area h-full pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aktiviti Saya</h1>
          <p className="text-xs text-gray-400">{activeCount} aktiviti aktif</p>
        </div>
      </div>

      <p className="px-5 text-sm text-gray-500 mb-4">
        Pilih aktiviti yang kamu nak cari buddy. Buddy akan match berdasarkan aktiviti yang sama.
      </p>

      {/* Activity cards */}
      <div className="px-5 space-y-3">
        {activities.map((act) => {
          const ua = userActivities[act.id];
          const isActive = ua?.is_active ?? false;
          const isSaving = saving === act.id;

          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl border overflow-hidden transition-all"
              style={{ borderColor: isActive ? "var(--brand)" : "#E5E7EB" }}
            >
              {/* Main row */}
              <div className="flex items-center gap-4 px-4 py-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: isActive ? "var(--brand-light)" : "#F3F4F6" }}
                >
                  {act.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{act.name_ms}</p>
                  <p className="text-xs text-gray-400 capitalize">{act.category}</p>
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggleActivity(act.id)}
                  disabled={isSaving}
                  className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                  style={{ background: isActive ? "var(--brand)" : "#D1D5DB" }}
                >
                  {isSaving ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                    </div>
                  ) : (
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                      style={{ transform: isActive ? "translateX(24px)" : "translateX(0)" }}
                    />
                  )}
                </button>
              </div>

              {/* Expanded options when active */}
              {isActive && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                  {/* Skill level */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Tahap kemahiran</p>
                    <div className="flex gap-2">
                      {(["beginner", "intermediate", "advanced"] as const).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => updateSkill(act.id, skill)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all"
                          style={ua?.skill_level === skill
                            ? { background: "var(--brand)", color: "white", borderColor: "var(--brand)" }
                            : { background: "transparent", color: "#6B7280", borderColor: "#E5E7EB" }}
                        >
                          {SKILL_LABELS[skill]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schedule note */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Jadual / nota</p>
                    <input
                      type="text"
                      defaultValue={ua?.schedule_note ?? ""}
                      onBlur={(e) => updateSchedule(act.id, e.target.value)}
                      placeholder="cth: Sabtu pagi, 7-9am"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
