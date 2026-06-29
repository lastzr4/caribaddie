"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type MatchRow = {
  id: string;
  activity_id: string;
  created_at: string;
  other: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    location_area: string | null;
  };
  activity: { name_ms: string; icon: string } | null;
  last_message: string | null;
  last_message_at: string | null;
  unread: number;
};

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j`;
  return `${Math.floor(h / 24)}h`;
}

const AVATAR_COLORS = ["#534AB7", "#0F6E56", "#854F0B", "#993C1D", "#1D6A9E"];

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Fetch matches + other user profile + activity + last message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rawMatches } = await (supabase as any)
        .from("matches")
        .select(`
          id, activity_id, created_at,
          user_a, user_b,
          activities ( name_ms, icon ),
          messages ( content, created_at, sender_id )
        `)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .eq("status", "matched")
        .order("created_at", { ascending: false });

      if (!rawMatches) { setLoading(false); return; }

      // For each match, fetch the other user's profile
      const enriched: MatchRow[] = await Promise.all(
        rawMatches.map(async (m: any) => {
          const otherId = m.user_a === user.id ? m.user_b : m.user_a;

          const { data: other } = await (supabase as any)
            .from("profiles")
            .select("id, display_name, avatar_url, location_area")
            .eq("id", otherId)
            .single();

          // Sort messages by time desc, pick last
          const msgs = (m.messages ?? []).sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          const last = msgs[0];
          const unread = msgs.filter((msg: any) => msg.sender_id !== user.id && !msg.read_at).length;

          return {
            id: m.id,
            activity_id: m.activity_id,
            created_at: m.created_at,
            other: other ?? { id: otherId, display_name: null, avatar_url: null, location_area: null },
            activity: m.activities ?? null,
            last_message: last?.content ?? null,
            last_message_at: last?.created_at ?? m.created_at,
            unread,
          };
        })
      );

      setMatches(enriched);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
        style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }} />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Match</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {matches.length > 0 ? `${matches.length} rakan aktiviti` : "Rakan aktiviti kamu"}
        </p>
      </div>

      {matches.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "var(--brand-light)" }}>💚</div>
          <div>
            <p className="text-lg font-bold text-gray-900">Tiada match lagi</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Swipe di Discover dan cari buddy aktiviti kamu!
            </p>
          </div>
          <Link href="/discover"
            className="text-white text-sm font-semibold px-8 py-3 rounded-full"
            style={{ background: "var(--brand)" }}>
            Mula Discover
          </Link>
        </div>
      ) : (
        /* Match list */
        <div className="flex-1 overflow-y-auto">
          {matches.map((match, i) => {
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <Link
                key={match.id}
                href={`/chat/${match.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: avatarColor }}
                  >
                    {match.other.avatar_url ? (
                      <img
                        src={match.other.avatar_url}
                        alt={match.other.display_name ?? ""}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      getInitials(match.other.display_name)
                    )}
                  </div>
                  {/* Activity icon badge */}
                  {match.activity && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs">
                      {match.activity.icon}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {match.other.display_name ?? "Buddy"}
                    </p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {timeAgo(match.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate">
                      {match.last_message
                        ? match.last_message
                        : `🎯 Match untuk ${match.activity?.name_ms ?? "aktiviti"}`}
                    </p>
                    {match.unread > 0 && (
                      <span
                        className="flex-shrink-0 ml-2 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                        style={{ background: "var(--brand)" }}
                      >
                        {match.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
