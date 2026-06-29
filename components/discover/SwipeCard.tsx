"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

type DiscoverProfile = Profile & { distance_km?: number | null };

const BG_GRADIENTS = [
  "from-violet-100 to-purple-200",
  "from-teal-100 to-emerald-200",
  "from-amber-100 to-orange-200",
  "from-pink-100 to-rose-200",
  "from-sky-100 to-blue-200",
];
const AVATAR_COLORS = ["#534AB7", "#0F6E56", "#854F0B", "#993C1D", "#1D6A9E"];

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDistance(km: number | null | undefined) {
  if (km == null) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

// ── Single swipe card ─────────────────────────────────────────
function SingleCard({
  profile,
  index,
  onSwipe,
}: {
  profile: DiscoverProfile;
  index: number;
  onSwipe: (liked: boolean) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const x = useMotionValue(0);
  const rotate      = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [30, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -30], [1, 0]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);

  const bg          = BG_GRADIENTS[index % BG_GRADIENTS.length];
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const dist        = formatDistance(profile.distance_km);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
      onSwipe(info.offset.x > 0);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity: cardOpacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.02 }}
    >
      {/* BUDDY stamp */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-10 left-6 z-20 rotate-[-18deg] border-[3px] border-[#1D9E75] rounded-xl px-3 py-1"
      >
        <span className="text-[#1D9E75] font-black text-xl tracking-widest">BUDDY</span>
      </motion.div>

      {/* SKIP stamp */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-10 right-6 z-20 rotate-[18deg] border-[3px] border-[#D85A30] rounded-xl px-3 py-1"
      >
        <span className="text-[#D85A30] font-black text-xl tracking-widest">SKIP</span>
      </motion.div>

      {/* Card body */}
      <div className="w-full h-full rounded-3xl overflow-hidden bg-white shadow-lg">
        {/* Avatar area */}
        <div
          className="relative overflow-hidden"
          style={{ height: "58%" }}
        >
          {profile.avatar_url && !imgError ? (
            /* Photo */
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? ""}
              onError={() => setImgError(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          ) : (
            /* Initials fallback */
            <div
              className={`w-full h-full bg-gradient-to-br ${bg} flex items-center justify-center`}
            >
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{ background: avatarColor + "33", color: avatarColor }}
              >
                {getInitials(profile.display_name)}
              </div>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            {/* Distance badge */}
            {dist && (
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                <span className="text-[10px]">📡</span>
                <span className="text-[10px] font-semibold text-gray-700">{dist}</span>
              </div>
            )}

            {/* Verified badge */}
            {profile.is_verified && (
              <div className="ml-auto bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#1D9E75">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span className="text-[10px] font-semibold text-green-700">Verified</span>
              </div>
            )}
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Info */}
        <div className="px-5 pt-3 pb-4">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {profile.display_name ?? "Tiada nama"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                📍 {profile.location_area ?? "Kawasan tidak ditetapkan"}
              </p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium mt-1"
              style={{ background: "var(--brand-light)", color: "var(--brand)" }}
            >
              {profile.gender === "female" ? "Perempuan" : profile.gender === "male" ? "Lelaki" : "—"}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-2">
            {profile.bio ?? "Belum ada bio."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main SwipeCard component ──────────────────────────────────
interface SwipeCardProps {
  activityId: string | null;
  userLat: number | null;
  userLng: number | null;
  radiusKm: number | null;
}

export function SwipeCard({ activityId, userLat, userLng, radiusKm }: SwipeCardProps) {
  const [profiles, setProfiles]   = useState<DiscoverProfile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [userId, setUserId]       = useState<string | null>(null);
  const supabase = createClient();

  const loadProfiles = useCallback(async (uid: string) => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_discover_profiles", {
      p_user_id:    uid,
      p_activity_id: activityId ?? null,
      p_lat:        userLat,
      p_lng:        userLng,
      p_radius_km:  radiusKm,
      p_limit:      20,
    });
    if (!error && data) {
      setProfiles(data as DiscoverProfile[]);
    }
    setLoading(false);
  }, [activityId, userLat, userLng, radiusKm]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      await loadProfiles(user.id);
    };
    init();
  }, [loadProfiles]);

  const handleSwipe = async (liked: boolean) => {
    const top = profiles[0];
    if (!top || !userId) return;

    // Record swipe in Supabase (best-effort, no blocking)
    if (activityId) {
      await supabase.from("swipes").insert({
        swiper_id:   userId,
        target_id:   top.id,
        activity_id: activityId,
        liked,
      }).then(() => {});
    }

    setProfiles((prev) => prev.slice(1));
  };

  const handleButton = (liked: boolean) => handleSwipe(liked);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }}
        />
        <p className="text-sm text-gray-400">Mencari buddy...</p>
      </div>
    );
  }

  // ── Empty state ──
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-16 px-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{ background: "var(--brand-light)" }}>
          🎉
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">Semua dah swipe!</p>
          <p className="text-sm text-gray-500 mt-1">
            Cuba tukar aktiviti, besarkan radius, atau cuba lagi nanti.
          </p>
        </div>
        <button
          onClick={() => userId && loadProfiles(userId)}
          className="text-sm font-semibold text-white px-6 py-2.5 rounded-full mt-2"
          style={{ background: "var(--brand)" }}
        >
          Cuba Semula
        </button>
      </div>
    );
  }

  // ── Card stack ──
  return (
    <div className="flex flex-col h-full px-4 pb-4">
      <div className="relative flex-1">
        {/* Background stack cards */}
        {profiles.slice(1, 3).reverse().map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 rounded-3xl bg-white shadow-md"
            style={{
              transform: `scale(${0.95 - i * 0.03}) translateY(${(i + 1) * 10}px)`,
              zIndex: i,
            }}
          />
        ))}

        {/* Active card */}
        <AnimatePresence>
          {profiles[0] && (
            <SingleCard
              key={profiles[0].id}
              profile={profiles[0]}
              index={0}
              onSwipe={handleSwipe}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-5 pt-4 pb-2">
        {/* Skip */}
        <button
          onClick={() => handleButton(false)}
          className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90"
          aria-label="Skip"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Buddy / like */}
        <button
          onClick={() => handleButton(true)}
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-90"
          style={{ background: "var(--brand)" }}
          aria-label="Buddy"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Super like */}
        <button
          className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90"
          aria-label="Super like"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
