export type { Database } from "./database";

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  gender: "male" | "female" | null;
  preferred_gender: "male" | "female" | "any" | null;
  bio: string | null;
  avatar_url: string | null;
  location_area: string | null;
  is_verified: boolean;
  lat: number | null;
  lng: number | null;
  distance_km?: number | null;
};

export type Activity = {
  id: string;
  name: string;
  icon: string;
  category: "solo" | "team" | "both";
};

export type Match = {
  id: string;
  user_a: string;
  user_b: string;
  activity_id: string;
  status: "pending" | "matched" | "rejected";
  created_at: string;
  other_user?: Profile;
  activity?: Activity;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};
