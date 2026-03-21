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
  date: string;
  time: string;
  description?: string; //cmt out if neces
  type?: EventType; //cmt out if neces
  budget?: number;//cmt out if neces
  theme?: string; //cmt out if neces
}

// SubEvent extends Event since backend handles both event and subevent as one
// Additional fields specific to sub-events
export interface SubEvent extends Event {
  eventId?: number; //cmt out if neces
  templateId?: number;//cmt out if neces
  activities?: any[]; //cmt out if neces
  createdAt?: string; //cmt out if neces
  updatedAt?: string; //cmt out if neces
}

export type EventRole = "Vendor" | "Organizer" | "Guest";
export type EventTab = "upcoming" | "invited" | "completed";

export type EventType = "Wedding" | "Engagement" | "Reception" | "Nikkah" | "Other";

export const EVENT_TYPES: EventType[] = [
  "Wedding",
  "Engagement",
  "Reception",
  "Nikkah",
  "Other",
];

export const EVENT_TYPE_TO_BACKEND: Record<EventType, string> = {
  Wedding: "WEDDING",
  Engagement: "ENGAGEMENT",
  Reception: "RECEPTION",
  Nikkah: "NIKKAH",
  Other: "OTHER",
};

