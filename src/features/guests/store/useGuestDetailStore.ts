import { create } from "zustand";
import { GuestDetailInterface } from "../types";

interface GuestDetailStore {
  guestDraft: GuestDetailInterface | null;
  setGuestDetail: (detail: GuestDetailInterface) => void;
  clearGuestDetail: () => void;
}

export const useGuestDetailStore = create<GuestDetailStore>((set) => ({
  guestDraft: null,
  setGuestDetail: (detail) => set({ guestDraft: detail }),
  clearGuestDetail: () => set({ guestDraft: null }),
}));