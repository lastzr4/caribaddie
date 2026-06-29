"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type OtherUser = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  location_area: string | null;
};

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatRoomPage() {
  const params = useParams();
  const matchId = params?.matchId as string;
  const router = useRouter();
  const supabase = createClient();

  const [messages, setMessages]   = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [activityName, setActivityName] = useState("");
  const [userId, setUserId]       = useState<string | null>(null);
  const [input, setInput]         = useState("");
  const [sending, setSending]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = useCallback(async (uid: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("messages")
      .select("id, sender_id, content, created_at")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });

    setMessages(data ?? []);

    // Mark messages as read
    await (supabase as any)
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("match_id", matchId)
      .neq("sender_id", uid)
      .is("read_at", null);
  }, [matchId]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);

      // Load match info
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: match } = await (supabase as any)
        .from("matches")
        .select("user_a, user_b, activities(name_ms, icon)")
        .eq("id", matchId)
        .single();

      if (!match) { router.push("/matches"); return; }

      const otherId = match.user_a === user.id ? match.user_b : match.user_a;
      setActivityName(`${match.activities?.icon ?? "🎯"} ${match.activities?.name_ms ?? "Aktiviti"}`);

      // Load other user profile
      const { data: other } = await (supabase as any)
        .from("profiles")
        .select("id, display_name, avatar_url, location_area")
        .eq("id", otherId)
        .single();
      setOtherUser(other);

      // Load messages
      await loadMessages(user.id);
      setLoading(false);
    };

    init();
  }, [matchId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Auto mark as read if from other user
          if (newMsg.sender_id !== userId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase as any).from("messages").update({ read_at: new Date().toISOString() })
              .eq("id", newMsg.id).then(() => {});
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [matchId, userId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !userId || sending) return;

    setSending(true);
    setInput("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("messages").insert({
      match_id:  matchId,
      sender_id: userId,
      content:   text,
    });

    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
        style={{ borderColor: "var(--brand) transparent var(--brand) var(--brand)" }} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{ background: "var(--brand)" }}>
          {otherUser?.avatar_url ? (
            <img src={otherUser.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : getInitials(otherUser?.display_name ?? null)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{otherUser?.display_name ?? "Buddy"}</p>
          <p className="text-xs text-gray-400 truncate">{activityName} · {otherUser?.location_area ?? ""}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">👋</p>
            <p className="text-sm font-semibold text-gray-700">Mula perbualan dengan {otherUser?.display_name ?? "buddy"}!</p>
            <p className="text-xs text-gray-400 mt-1">Korang match untuk {activityName}</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[78%]">
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={isMe
                    ? { background: "var(--brand)", color: "white", borderBottomRightRadius: 6 }
                    : { background: "white", color: "#1a1a1a", borderBottomLeftRadius: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }
                  }
                >
                  {msg.content}
                </div>
                <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-end gap-3 flex-shrink-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Taip mesej..."
          rows={1}
          className="flex-1 resize-none bg-gray-100 rounded-2xl px-4 py-2.5 text-sm outline-none max-h-28"
          style={{ lineHeight: "1.5" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
          style={{ background: "var(--brand)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
