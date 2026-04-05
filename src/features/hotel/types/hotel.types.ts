export interface Hotel {
  id: number;
  eventId: number;
  name: string;
  location: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  totalRooms: number;
  bookingReference: string | null;
  contactPerson: string | null;
  contactPhone: string | null;
  specialRequests: string | null;
}

export interface RoomAllocation {
  id: number;
  hotelId: number;
  guestId: number;
  roomNumber: string;
  roomType: string | null;
  notes: string | null;
  status: "allocated" | "confirmed" | "checked-in" | "checked-out";
}

export interface HotelWithAllocations extends Hotel {
  allocations: RoomAllocation[];
}

export interface AcceptedGuestWithRoom {
  assigned_room: string | null;
  user: {
    id: number;
    username: string;
    phone: string;
    photo: string | null;
  };
}
