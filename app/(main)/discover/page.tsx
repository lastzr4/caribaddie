import { SwipeCard } from "@/components/discover/SwipeCard";
import { ActivityFilter } from "@/components/discover/ActivityFilter";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">CariBuddy</h1>
          <p className="text-xs text-gray-400 mt-0.5">📍 Kuala Lumpur & Selangor</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-[#EEEDFE] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Activity filter */}
      <div className="px-5 flex-shrink-0">
        <ActivityFilter />
      </div>

      {/* Swipe area */}
      <div className="flex-1 overflow-hidden mt-3">
        <SwipeCard />
      </div>
    </div>
  );
}
