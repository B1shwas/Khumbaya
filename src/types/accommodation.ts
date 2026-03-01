// Accommodation Types

export interface Room {
  id: string;
  name: string;
  type: "single" | "double" | "suite" | "villa";
  capacity: number;
  available: number;
  pricePerNight: number;
  amenities: string[];
  assignedGuests?: string[]; // Guest IDs assigned to this room
}

export interface RoomAssignment {
  id: string;
  guestId: string;
  guestName: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  status: "confirmed" | "pending" | "cancelled" | "checked-in" | "checked-out";
}

export interface AccommodationBooking {
  id: string;
  eventId: string;
  rooms: Room[];
  assignments: RoomAssignment[];
  createdAt: string;
  updatedAt: string;
}

// Helper functions
export const getRoomCapacity = (room: Room): number => room.capacity;
export const getAvailableRooms = (room: Room): number => room.available;
export const isRoomFull = (room: Room): boolean => room.available === 0;

export const getRoomTypeIcon = (type: Room["type"]): string => {
  switch (type) {
    case "single":
      return "person";
    case "double":
      return "people";
    case "suite":
      return "bed";
    case "villa":
      return "home";
    default:
      return "bed";
  }
};

export const getStatusColor = (status: RoomAssignment["status"]): string => {
  switch (status) {
    case "confirmed":
      return "#10B981";
    case "pending":
      return "#F59E0B";
    case "cancelled":
      return "#EF4444";
    case "checked-in":
      return "#3B82F6";
    case "checked-out":
      return "#6B7280";
    default:
      return "#6B7280";
  }
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

export const calculateTotalPrice = (
  pricePerNight: number,
  nights: number
): number => {
  return pricePerNight * nights;
};
