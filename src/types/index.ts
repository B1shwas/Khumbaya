


export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
  invited: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: string;
  phone?: string;
  email?: string;
  selected?: boolean;
  imageUrl?: string;
  verified?: boolean;
  reviews?: number;
  yearsExperience?: number;
  description?: string;
}

export interface EventHighlight {
  id: string;
  title: string;
  type: string;
  theme: string;

  description: string | null;
  location: string | null;
  budget: number | null;

  imageUrl: string | null;

  organizer: number;
  parentId: number | null;

  status: string;

  startDateTime: string;
  endDateTime: string;

  createdAt: string;
  updatedAt: string;
}

export interface EventService {
  id: string;
  label: string;
  icon: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface GuestEventInfo {
  id: string;
  title: string;
  imageUrl: string;
  /** Pre-formatted range, e.g. "Oct 24 – Oct 27, 2024" */
  dateRange: string;
  venue: string;
  location: string;
  highlights: EventHighlight[];
  services: EventService[];
  familyName: string;
  familyMembers: FamilyMember[];
  confirmedCount: number;
}
