"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

// Placeholder — replace with real Supabase data via useQuery
const MOCK_PROFILES: (Profile & { activity_note?: string; skill?: string })[] = [
  {
    id: "1",
    username: "sarah_a",
    display_name: "Sarah A.",
    gender: "female",
    preferred_gender: "female",
    bio: "Nak cari buddy jogging pagi kawasan Bangsar. Prefer perempuan.",
    avatar_url: null,
    location_area: "Bangsar",
    is_verified: true,
    activity_note: "5km/hari",
    skill: "Beginner",
  },
  {
    id: "2",
    username: "mira_runs",
    display_name: "Mira K.",
    gender: "female",
    preferred_gender: "any",
    bio: "Suka jogging setiap pagi. Target 10km bulan ni!",
    avatar_url: null,
    location_area: "Petaling Jaya",
    is_verified: false,
    activity_note: "10km/minggu",
    skill: "Intermediate",
  },
];

const AVATAR_COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAEEDA", text: "#854F0B" },
  { bg: "#FAECE7", text: "#993C1D" },
];

export function SwipeCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, -20], [1, 0]);

  const profile = MOCK_PROFILES[currentIndex];
  const avatarColor = AVATAR_COLORS[currentIndex % AVATAR_COLORS.length];

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      handleLike();
    } else if (info.offset.x < -100) {
      handleNope();
    }
  };

  const handleLike = () => setCurrentIndex((i) => i + 1);
  const handleNope = () => setCurrentIndex((i) => i + 1);

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-3 text-center py-12">
        <span className="text-5xl">🎉</span>
        <p className="font-semibold text-gray-800">Semua dah swipe!</p>
        <p className="text-sm text-gray-500">Cuba lagi nanti atau tukar aktiviti.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="relative h-[460px]">
        <motion.div
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Like / Nope indicators */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-10 border-2 border-[#1D9E75] text-[#1D9E75] font-bold text-lg px-3 py-1 rounded-lg rotate-[-15deg]"
          >
            BUDDY ✓
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 z-10 border-2 border-[#D85A30] text-[#D85A30] font-bold text-lg px-3 py-1 rounded-lg rotate-[15deg]"
          >
            SKIP ✗
          </motion.div>

          {/* Card */}
          <div className="w-full h-full bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Avatar area */}
            <div
              className="h-52 flex items-center justify-center"
              style={{ background: avatarColor.bg }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold"
                style={{ background: avatarColor.text + "22", color: avatarColor.text }}
              >
                {getInitials(profile.display_name)}
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {profile.display_name}
                    {profile.is_verified && (
                      <span className="ml-1.5 text-[#1D9E75] text-sm">✓</span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">📍 {profile.location_area}</p>
                </div>
                <span className="text-xs bg-[#EEEDFE] text-[#534AB7] px-2 py-1 rounded-full">
                  {profile.skill}
                </span>
              </div>

              <div className="flex gap-2 mb-3 flex-wrap">
                {profile.activity_note && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    🏃 {profile.activity_note}
                  </span>
                )}
                <span className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2 py-1 rounded-full">
                  Aktif bulan ini
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={handleNope}
          className="w-14 h-14 rounded-full border-2 border-[#F0997B] flex items-center justify-center text-2xl hover:bg-orange-50 transition-colors"
          aria-label="Skip"
        >
          ✗
        </button>
        <button
          onClick={handleLike}
          className="w-14 h-14 rounded-full border-2 border-[#5DCAA5] flex items-center justify-center text-2xl hover:bg-green-50 transition-colors"
          aria-label="Buddy"
        >
          💚
        </button>
      </div>
    </div>
  );
}
