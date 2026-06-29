"use client";

import { useState, useEffect } from "react";
import { SwipeCard } from "@/components/discover/SwipeCard";
import { ActivityFilter } from "@/components/discover/ActivityFilter";

const RADIUS_OPTIONS = [
  { label: "5 km",   value: 5 },
  { label: "10 km",  value: 10 },
  { label: "20 km",  value: 20 },
  { label: "Semua",  value: null },
];

export default function DiscoverPage() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [radiusKm, setRadiusKm]                 = useState<number | null>(10);
  const [userCoords, setUserCoords]             = useState<{ lat: number; lng: number } | null>(null);
  const [gpsActive, setGpsActive]               = useState(false);
  const [showRadiusBar, setShowRadiusBar]        = useState(false);

  // Try to get GPS silently on load (user already granted in profile edit)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsActive(true);
        setShowRadiusBar(true);
      },
      () => {
        // Permission not granted — fallback to area matching, no radius bar
        setGpsActive(false);
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">CariBuddy</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {gpsActive ? `📡 GPS aktif · ${radiusKm ? `${radiusKm} km` : "Semua kawasan"}` : "📍 Kuala Lumpur & Selangor"}
          </p>
        </div>

        {/* Filter icon — shows radius bar toggle when GPS active */}
        <button
          onClick={() => gpsActive && setShowRadiusBar((v) => !v)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={gpsActive ? { background: "var(--brand-light)" } : { background: "#EEEDFE" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={gpsActive ? "var(--brand)" : "#7F77DD"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="20" y2="12"/>
            <line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Radius chips — only shown when GPS active */}
      {gpsActive && showRadiusBar && (
        <div className="px-5 pb-2 flex-shrink-0">
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((opt) => {
              const active = radiusKm === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  onClick={() => setRadiusKm(opt.value)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={active
                    ? { background: "var(--brand)", color: "white", borderColor: "var(--brand)" }
                    : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity filter */}
      <div className="px-5 flex-shrink-0">
        <ActivityFilter
          selected={selectedActivity}
          onSelect={setSelectedActivity}
        />
      </div>

      {/* Swipe area */}
      <div className="flex-1 overflow-hidden mt-3">
        <SwipeCard
          activityId={selectedActivity}
          userLat={userCoords?.lat ?? null}
          userLng={userCoords?.lng ?? null}
          radiusKm={gpsActive ? radiusKm : null}
        />
      </div>
    </div>
  );
}
