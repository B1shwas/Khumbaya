import { User } from "@/src/store/AuthStore";

export interface EventVehicle {
  id: number;
  vehicleName: string;
  eventId: number;
  driverName: string | null;
  driverNumber: string | null;
  capacity: number | null;
  availablityStartTime: string | Date | null;
  availablityEndTime: string | Date | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignedVehicle {
  id?: number;
  vehicleId: number;
  invitationId: number;
  pickupTime: string | Date | null;
  dropoffTime: string | Date | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VEHICLE_WITH_ASSIGNMENT {
  vehicle: EventVehicle;
  assigned_vehicle: AssignedVehicle | null;
  invited_user: User | null;
}

export interface LogisticsTimelineItem {
  id: number;
  vehicleName: string;
  driverName: string;
  driverNumber: string;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  pickupLocation: string;
  dropoffLocation: string;
  guestName: string;
  guestId?: number;
  type: 'assignment' | 'availability';
}

/**
 * Maps the API response to a unified Timeline item structure
 */
export const mapToLogisticsTimeline = (data: VEHICLE_WITH_ASSIGNMENT | VEHICLE_WITH_ASSIGNMENT[]): LogisticsTimelineItem[] => {
  const items = Array.isArray(data) ? data : [data];
  
  return items.map((item, index) => {
    const { vehicle, assigned_vehicle, invited_user } = item;
    
    // Determine if we show assignment info or fallback to vehicle availability
    const isAssigned = !!assigned_vehicle;
    
    const toDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    return {
      id: assigned_vehicle?.id ?? vehicle.id ?? index,
      vehicleName: vehicle.vehicleName,
      driverName: vehicle.driverName ?? "No Driver",
      driverNumber: vehicle.driverNumber ?? "N/A",
      pickupTime: toDate(assigned_vehicle?.pickupTime ?? vehicle.availablityStartTime),
      dropoffTime: toDate(assigned_vehicle?.dropoffTime ?? vehicle.availablityEndTime),
      pickupLocation: assigned_vehicle?.pickupLocation ?? "Location not set",
      dropoffLocation: assigned_vehicle?.dropoffLocation ?? "Location not set",
      guestName: invited_user?.username ?? "Unassigned",
      guestId: assigned_vehicle?.invitationId,
      type: isAssigned ? 'assignment' : 'availability'
    };
  });
};

export interface SelectTransportation {
  id: number;
  invitation_name: string;
  isArrivalPickupRequired: boolean;
  isDeparturePickupRequired: boolean;
  arrival_date_time: string;
  departure_date_time: string;
  arrival_info: string;
  departure_info: string;
  isAccomodation: boolean;
  eventId: number;
}
