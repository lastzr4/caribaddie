"use client";

const ACTIVITIES = [
  { id: "all",      label: "Semua",    icon: "✨" },
  { id: "jogging",  label: "Jogging",  icon: "🏃" },
  { id: "pilates",  label: "Pilates",  icon: "🧘" },
  { id: "pingpong", label: "Ping Pong",icon: "🏓" },
  { id: "movies",   label: "Wayang",   icon: "🎬" },
  { id: "badminton",label: "Badminton",icon: "🏸" },
  { id: "hiking",   label: "Hiking",   icon: "🥾" },
  { id: "cycling",  label: "Basikal",  icon: "🚴" },
  { id: "swimming", label: "Renang",   icon: "🏊" },
  { id: "futsal",   label: "Futsal",   icon: "⚽" },
  { id: "marathon", label: "Marathon", icon: "🏅" },
  { id: "gym",      label: "Gym",      icon: "💪" },
  { id: "tennis",   label: "Tenis",    icon: "🎾" },
];

interface Props {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function ActivityFilter({ selected, onSelect }: Props) {
  const current = selected ?? "all";

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {ACTIVITIES.map((activity) => {
        const active = current === activity.id;
        return (
          <button
            key={activity.id}
            onClick={() => onSelect(activity.id === "all" ? null : activity.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0 font-medium border"
            style={active
              ? { background: "var(--brand)", color: "white", borderColor: "var(--brand)" }
              : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" }}
          >
            <span>{activity.icon}</span>
            <span>{activity.label}</span>
          </button>
        );
      })}
    </div>
  );
}
