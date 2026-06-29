"use client";

import { useState } from "react";

const ACTIVITIES = [
  { id: "jogging", label: "Jogging", icon: "🏃" },
  { id: "pilates", label: "Pilates", icon: "🧘" },
  { id: "pingpong", label: "Ping Pong", icon: "🏓" },
  { id: "movies", label: "Movies", icon: "🎬" },
  { id: "badminton", label: "Badminton", icon: "🏸" },
  { id: "hiking", label: "Hiking", icon: "🥾" },
  { id: "cycling", label: "Basikal", icon: "🚴" },
  { id: "swimming", label: "Renang", icon: "🏊" },
];

export function ActivityFilter() {
  const [selected, setSelected] = useState("jogging");

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {ACTIVITIES.map((activity) => (
        <button
          key={activity.id}
          onClick={() => setSelected(activity.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all flex-shrink-0 ${
            selected === activity.id
              ? "bg-[#7F77DD] text-white font-medium"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <span>{activity.icon}</span>
          <span>{activity.label}</span>
        </button>
      ))}
    </div>
  );
}
