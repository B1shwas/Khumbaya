// Transportation Types

export interface TransportVehicle {
  id: string;
  name: string;
  type: "car" | "bus" | "shuttle" | "limo";
  capacity: number;
  available: number;
  assignedGuests?: string[]; // Guest IDs assigned to this vehicle
}

export interface TransportRoute {
  id: string;
  name: string;
  pickupLocation: string;
  dropoffLocation: string;
  departureTime: string;
  arrivalTime: string;
}

export interface TransportAssignment {
  id: string;
  guestId: string;
  guestName: string;
  vehicleId: string;
  routeId: string;
  pickupTime?: string;
  seatNumber?: number;
  status: "confirmed" | "pending" | "cancelled";
}

export interface TransportBooking {
  id: string;
  eventId: string;
  vehicles: TransportVehicle[];
  routes: TransportRoute[];
  assignments: TransportAssignment[];
  createdAt: string;
  updatedAt: string;
}

// Helper functions
export const getVehicleCapacity = (vehicle: TransportVehicle): number =>
  vehicle.capacity;
export const getAvailableSeats = (vehicle: TransportVehicle): number =>
  vehicle.available;
export const isVehicleFull = (vehicle: TransportVehicle): boolean =>
  vehicle.available === 0;

export const getVehicleTypeIcon = (type: TransportVehicle["type"]): string => {
  switch (type) {
    case "car":
      return "car-sport";
    case "bus":
      return "bus";
    case "shuttle":
      return "git-compare";
    case "limo":
      return "car";
    default:
      return "car";
  }
};

export const getStatusColor = (
  status: TransportAssignment["status"]
): string => {
  switch (status) {
    case "confirmed":
      return "#10B981";
    case "pending":
      return "#F59E0B";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};
