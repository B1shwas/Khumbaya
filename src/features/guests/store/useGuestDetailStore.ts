import { create } from "zustand";
import { FamilyGroup, GuestDetailInterface } from "../types";

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

interface FamilyGuestStore {
  familyGroup:FamilyGroup | null;
  setFamilyGroup: (familyGroup: FamilyGroup) => void;
  clearFamilyGroup: () => void;
}

export const useFamilyGuestStore = create<FamilyGuestStore>((set) => ({
  familyGroup: null,
  setFamilyGroup: (familyGroup) => set({ familyGroup }),
  clearFamilyGroup: () => set({ familyGroup: null }),
}));