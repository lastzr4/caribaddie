import { create } from "zustand";
import type { Profile } from "@/types";

type UserStore = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  selectedActivityId: null,
  setSelectedActivityId: (id) => set({ selectedActivityId: id }),
}));
