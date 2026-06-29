import { SwipeCard } from "@/components/discover/SwipeCard";
import { ActivityFilter } from "@/components/discover/ActivityFilter";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col h-full px-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900">CariBuddy</h1>
        <span className="text-xs bg-[#EEEDFE] text-[#534AB7] px-3 py-1 rounded-full font-medium">
          KL & Selangor
        </span>
      </div>

      <ActivityFilter />

      <div className="flex-1 flex items-center justify-center mt-4">
        <SwipeCard />
      </div>
    </div>
  );
}
