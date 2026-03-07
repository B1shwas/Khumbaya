export interface Event {
  id: string;
  invitationId?: number;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  venue: string;
  imageUrl: string;
  role: EventRole;
  status: EventTab;

  time: string;
}

export type EventRole = "Vendor" | "Organizer" | "Guest";
export type EventTab = "upcoming" | "invited" | "completed";
