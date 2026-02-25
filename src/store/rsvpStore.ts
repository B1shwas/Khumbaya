import { create } from "zustand";

export type RSVPGuest = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relation?: string;
  isFromFamily: boolean;
  isSelf?: boolean;
  // For booking details
  foodPreference?: string;
  idImage?: string;
  isAdult?: boolean;
  dob?: string;
  height?: string;
  idNumber?: string;
};

type RSVPState = {
  eventId: string | null;
  selectedGuests: RSVPGuest[];
  totalGuests: number;
  isLoading: boolean;

  // Actions
  setEventId: (eventId: string) => void;
  setTotalGuests: (count: number) => void;
  toggleGuest: (guest: RSVPGuest) => void;
  addManualGuest: (guest: Omit<RSVPGuest, "id" | "isFromFamily">) => void;
  removeGuest: (guestId: string) => void;
  updateGuest: (guestId: string, data: Partial<RSVPGuest>) => void;
  resetRSVP: () => void;
  initializeFromFamily: (familyMembers: RSVPGuest[]) => void;
};

export const useRSVPStore = create<RSVPState>((set, get) => ({
  eventId: null,
  selectedGuests: [],
  totalGuests: 1,
  isLoading: false,

  setEventId: (eventId) => set({ eventId }),

  setTotalGuests: (count) => set({ totalGuests: count }),

  toggleGuest: (guest) => {
    const exists = get().selectedGuests.find((g) => g.id === guest.id);

    if (exists) {
      // Cannot remove self
      if (guest.isSelf) return;

      set({
        selectedGuests: get().selectedGuests.filter((g) => g.id !== guest.id),
      });
    } else {
      set({
        selectedGuests: [...get().selectedGuests, guest],
      });
    }
  },

  addManualGuest: (guest) => {
    const newGuest: RSVPGuest = {
      ...guest,
      id: `manual-${Date.now()}`,
      isFromFamily: false,
    };
    set({
      selectedGuests: [...get().selectedGuests, newGuest],
    });
  },

  removeGuest: (guestId) => {
    // Cannot remove self
    const guest = get().selectedGuests.find((g) => g.id === guestId);
    if (guest?.isSelf) return;

    set({
      selectedGuests: get().selectedGuests.filter((g) => g.id !== guestId),
    });
  },

  updateGuest: (guestId, data) =>
    set({
      selectedGuests: get().selectedGuests.map((g) =>
        g.id === guestId ? { ...g, ...data } : g
      ),
    }),

  resetRSVP: () =>
    set({
      eventId: null,
      selectedGuests: [],
      totalGuests: 1,
    }),

  initializeFromFamily: (familyMembers) => {
    // Add all family members as selectable guests
    // Self is always selected
    const guestsWithSelection = familyMembers.map((member) => ({
      ...member,
      isFromFamily: true,
    }));

    set({ selectedGuests: guestsWithSelection });
  },
}));
