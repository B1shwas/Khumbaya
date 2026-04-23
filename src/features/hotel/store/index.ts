import { User } from "@/src/store/AuthStore";
import { create } from "zustand";

export interface Hotel_responce {
  user_detail: User | null;
  user_room: string | null;
  category: string | null;
  invitationId: number;
  hasCheckedIn?: boolean;
  hasCheckedOut?: boolean;
}

interface RoomUserDraftStore {
  eventId: number | null;
  selectedRoom: string | null;
  hotelresponces: Hotel_responce[] | null;
  setHotelResponces: ({
    eventId,
    room,
    hotelresponces,
  }: {
    eventId: number | null;
    room: string;
    hotelresponces: Hotel_responce[];
  }) => void;
  clearHotelResponces: () => void;
}

export const useRoomUserDraftStore = create<RoomUserDraftStore>((set) => ({
  eventId: null,
  selectedRoom: null,
  hotelresponces: null,
  setHotelResponces: ({ eventId, room, hotelresponces }) =>
    set({ eventId, selectedRoom: room, hotelresponces }),
  clearHotelResponces: () =>
    set({ eventId: null, selectedRoom: null, hotelresponces: null }),
}));


