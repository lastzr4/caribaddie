"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

const MOCK_PROFILES: (Profile & { activity_note?: string; skill?: string })[] = [
  {
    id: "1",
    username: "sarah_a",
    display_name: "Sarah A.",
    gender: "female",
    preferred_gender: "female",
    bio: "Nak cari buddy jogging pagi kawasan Bangsar. Prefer perempuan. Biasanya lari 5km sehari sebelum kerja!",
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
    bio: "Suka jogging setiap pagi. Target 10km bulan ni! Weekend biasanya pergi Tasik Perdana.",
    avatar_url: null,
    location_area: "Petaling Jaya",
    is_verified: false,
    activity_note: "10km/minggu",
    skill: "Intermediate",
  },
  {
    id: "3",
    username: "anis_fit",
    display_name: "Anis R.",
    gender: "female",
    preferred_gender: "female",
    bio: "Pilates enthusiast! Dah 2 tahun buat pilates. Nak cari kawan yang sama minat.",
    avatar_url: null,
    location_area: "Mont Kiara",
    is_verified: true,
    activity_note: "3x seminggu",
    skill: "Advanced",
  },
];

const BG_GRADIENTS = [
  "from-violet-100 to-purple-200",
  "from-teal-100 to-emerald-200",
  "from-amber-100 to-orange-200",
  "from-pink-100 to-rose-200",
];
const AVATAR_COLORS = ["#534AB7", "#0F6E56", "#854F0B", "#993C1D"];

function SingleCard({ profile, index, onSwipe }: {
  profile: Profile & { activity_note?: string; skill?: string };
  index: number;
  onSwipe: (liked: boolean) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [30, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -30], [1, 0]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);

  const bg = BG_GRADIENTS[index % BG_GRADIENTS.length];
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400;
    if (swipe) onSwipe(info.offset.x > 0);
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
      {/* Like stamp */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-10 left-6 z-20 rotate-[-18deg] border-[3px] border-[#1D9E75] rounded-xl px-3 py-1"
      >
        <span className="text-[#1D9E75] font-black text-xl tracking-widest">BUDDY</span>
      </motion.div>

      {/* Nope stamp */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-10 right-6 z-20 rotate-[18deg] border-[3px] border-[#D85A30] rounded-xl px-3 py-1"
      >
        <span className="text-[#D85A30] font-black text-xl tracking-widest">SKIP</span>
      </motion.div>

      {/* Card */}
      <div className="w-full h-full rounded-3xl overflow-hidden bg-white shadow-lg">
        {/* Photo / avatar area */}
        <div className={`relative h-[58%] bg-gradient-to-br ${bg} flex items-center justify-center`}>
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold shadow-inner"
            style={{ background: avatarColor + "33", color: avatarColor }}
          >
            {getInitials(profile.display_name)}
          </div>

          {profile.is_verified && (
            <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#1D9E75"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span className="text-[10px] font-semibold text-green-700">Verified</span>
            </div>
          )}

          {/* Gradient overlay bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Info */}
        <div className="px-5 pt-3 pb-4">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{profile.display_name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">📍 {profile.location_area} · {profile.skill}</p>
            </div>
            <span className="text-xs bg-[#EEEDFE] text-[#534AB7] px-2.5 py-1 rounded-full font-medium mt-1">
              🏃 {profile.activity_note}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-2">
            {profile.bio}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function SwipeCard() {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [lastSwipe, setLastSwipe] = useState<"like" | "nope" | null>(null);

  const handleSwipe = (liked: boolean) => {
    setLastSwipe(liked ? "like" : "nope");
    setTimeout(() => {
      setProfiles((prev) => prev.slice(1));
      setLastSwipe(null);
    }, 100);
  };

  const handleButton = (liked: boolean) => {
    setLastSwipe(liked ? "like" : "nope");
    setTimeout(() => {
      setProfiles((prev) => prev.slice(1));
      setLastSwipe(null);
    }, 300);
  };

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-[#EEEDFE] flex items-center justify-center text-4xl">🎉</div>
        <div>
          <p className="text-lg font-bold text-gray-900">Semua dah swipe!</p>
          <p className="text-sm text-gray-500 mt-1">Cuba lagi nanti atau tukar aktiviti lain.</p>
        </div>
        <button
          onClick={() => setProfiles(MOCK_PROFILES)}
          className="bg-[#7F77DD] text-white text-sm font-medium px-6 py-2.5 rounded-full mt-2"
        >
          Cuba Semula
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-4 pb-4">
      {/* Card stack */}
      <div className="relative flex-1">
        {/* Background cards (stack effect) */}
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

        {/* Active swipe card */}
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
        <button
          onClick={() => handleButton(false)}
          className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90"
          aria-label="Skip"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <button
          onClick={() => handleButton(true)}
          className="w-16 h-16 rounded-full bg-[#7F77DD] shadow-lg flex items-center justify-center transition-transform active:scale-90"
          aria-label="Buddy"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

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
