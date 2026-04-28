import { User } from "@/src/store/AuthStore";

export interface EventVehicle {
   id: number | undefined;
  vehicleName: string;
  eventId: number;
  driverName: string | undefined | null;
  driverNumber: string | undefined | null;
  capacity: number | undefined | null;
  availablityStartTime: Date | undefined | null;
  availablityEndTime: Date | undefined | null;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

}

export interface AssignedVehicle {
   vehicleId: number;
  invitationId: number;
  fromTime: Date | undefined | null;
  toTime: Date | undefined | null;
  fromLocation: string | undefined | null;
  toLocation: string | undefined | null;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}
export interface AssignVehileInputType {


  vehicleId: number ,
  invitationId: number ,
  isArrival:boolean| null | undefined  , 
 isDeparture:boolean| null |undefined  , 
  fromTime: Date | undefined | null,
  toTime: Date | undefined | null,
  fromLocation: string | undefined | null,
  toLocation: string | undefined | null


}

export interface VEHICLE_WITH_ASSIGNMENT {
  vehicle: EventVehicle;
  assignedVehicle: AssignedVehicle | null;
  invitedUser: User | null;
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
    const { vehicle, assignedVehicle, invitedUser } = item;
    
    // Determine if we show assignment info or fallback to vehicle availability
    const isAssigned = !!assignedVehicle;
    
    const toDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    return {
      id: assignedVehicle?.invitationId ?? assignedVehicle?.vehicleId ?? vehicle.id ?? index,
      vehicleName: vehicle.vehicleName,
      driverName: vehicle.driverName ?? "No Driver",
      driverNumber: vehicle.driverNumber ?? "N/A",
      pickupTime: toDate(assignedVehicle?.fromTime ?? vehicle.availablityStartTime),
      dropoffTime: toDate(assignedVehicle?.toTime ?? vehicle.availablityEndTime),
      pickupLocation: assignedVehicle?.fromLocation ?? "Location not set",
      dropoffLocation: assignedVehicle?.toLocation ?? "Location not set",
      guestName: invitedUser?.username ?? "Unassigned",
      guestId: assignedVehicle?.invitationId,
      type: isAssigned ? 'assignment' : 'availability'
    };
  });
};

export interface SelectTransportation {
  id: number;
  user:{
    name: string;
    familyId: number;
    foodPreference: string;
    phone: string;
    email: string;
  }
  isArrivalPickupRequired: boolean;
  isDeparturePickupRequired: boolean;
  arrivalDatetime: string | null;
  departureDatetime: string | null;
  arrivalLocation: string | null;
  departureLocation: string | null;
  arrivalInfo: string | null;
  departureInfo: string | null;
  isAccomodation: boolean;
  eventId: number;
}
