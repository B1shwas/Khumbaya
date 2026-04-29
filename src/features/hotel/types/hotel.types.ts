import { User } from "@/src/store/AuthStore";

export interface RoomAllocation {
  id: number;
  hotelId: number;
  guestId: number;
  roomNumber: string;
  roomType: string | null;
  notes: string | null;
  status: "allocated" | "confirmed" | "checked-in" | "checked-out";
}

export interface GuestWithRoom {
  category: string;
  hasCheckedIn: boolean | null;
  hasCheckedOut: boolean | null;
  invitationId: number;
  room?: string | null;
  user: User;
}

export interface RoomData {
  room: string;
  eachuser: GuestWithRoom[];
}
