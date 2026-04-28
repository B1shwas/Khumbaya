import { MaterialIcons } from "@expo/vector-icons";

export interface LogisticsGuestAvatar {
  initials: string;
  name: string;
  color: string;
  txColor: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  status: "Completed" | "On Route" | "Upcoming";
  from: string;
  to: string;
  groupName: string;
  guestCount: number;
  guests: LogisticsGuestAvatar[];
  pickupIcon: keyof typeof MaterialIcons.glyphMap;
  dropoffIcon: keyof typeof MaterialIcons.glyphMap;
}

export interface VehicleSummary {
  id: string;
  vehicle_name: string;
  type: string;
  status: "Active - On Route" | "Idle";
  loadFactor: number;
  tripsCompleted: number;
  totalTrips: number;
  date: string;
}
