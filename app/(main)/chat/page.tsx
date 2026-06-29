"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type ConversationPreview = {
  matchId: string;
  otherId: string;
  otherName: string | null;
  otherAvatar: string | null;
  activityIcon: string;
  activityName: string;
  lastMessage: string | null;
  lastAt: string | null;
  unread: number;
};

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

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ["#534AB7", "#0F6E56", "#854F0B", "#993C1D", "#1D6A9E"];

export default function ChatListPage() {
  const [convos, setConvos] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rawMatches } = await (supabase as any)
        .from("matches")
        .select(`id, user_a, user_b, activity_id, activities(name_ms, icon), messages(content, created_at, sender_id, read_at)`)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .eq("status", "matched");

      if (!rawMatches) { setLoading(false); return; }

      const list: ConversationPreview[] = await Promise.all(
        rawMatches.map(async (m: any) => {
          const otherId = m.user_a === user.id ? m.user_b : m.user_a;
          const { data: other } = await (supabase as any)
            .from("profiles").select("display_name, avatar_url").eq("id", otherId).single();

          const msgs = (m.messages ?? []).sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          const last = msgs[0];
          const unread = msgs.filter((msg: any) => msg.sender_id !== user.id && !msg.read_at).length;

          return {
            matchId: m.id,
            otherId,
            otherName: other?.display_name ?? null,
            otherAvatar: other?.avatar_url ?? null,
            activityIcon: m.activities?.icon ?? "🎯",
            activityName: m.activities?.name_ms ?? "Aktiviti",
            lastMessage: last?.content ?? null,
            lastAt: last?.created_at ?? null,
            unread,
          };
        })
      );

      // Sort by most recent message
      list.sort((a, b) => {
        if (!a.lastAt) return 1;
        if (!b.lastAt) return -1;
        return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
      });

      setConvos(list);
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
      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chat</h1>
        <p className="text-xs text-gray-400 mt-0.5">Perbualan dengan buddy kamu</p>
      </div>

      {convos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "var(--brand-light)" }}>💬</div>
          <div>
            <p className="text-lg font-bold text-gray-900">Tiada perbualan</p>
            <p className="text-sm text-gray-500 mt-1">Chat muncul selepas kamu match dengan buddy.</p>
          </div>
          <Link href="/discover" className="text-white text-sm font-semibold px-8 py-3 rounded-full"
            style={{ background: "var(--brand)" }}>
            Cari Buddy
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {convos.map((c, i) => (
            <Link key={c.matchId} href={`/chat/${c.matchId}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                  {c.otherAvatar ? (
                    <img src={c.otherAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : getInitials(c.otherName)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs">
                  {c.activityIcon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-sm text-gray-900 truncate">{c.otherName ?? "Buddy"}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{timeAgo(c.lastAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate">
                    {c.lastMessage ?? `${c.activityIcon} Match ${c.activityName}`}
                  </p>
                  {c.unread > 0 && (
                    <span className="flex-shrink-0 ml-2 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ background: "var(--brand)" }}>
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
