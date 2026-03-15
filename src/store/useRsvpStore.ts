import { create } from "zustand";

export interface RsvpDraft {
  userId: number;
  familyId?: number;
  memberName?: string;
  rawStatus: string | null;
  rawArrival: string | null;
  rawDeparture: string | null;
  rawAccommodation: boolean | null;
  rawIsArrivalPickupRequired: boolean | null;
  rawIsDeparturePickupRequired: boolean | null;
  rawNotes: string | null;
}

interface RsvpState {
  draft: RsvpDraft | null;
  setDraft: (draft: RsvpDraft) => void;
  clearDraft: () => void;
}

export const useRsvpStore = create<RsvpState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
