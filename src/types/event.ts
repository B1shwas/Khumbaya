export type EventType = 'invited' | 'normal';
export type EventStatus = 'upcoming' | 'present' | 'past';
export type EventPhase = 'planning' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface SubEvent {
  id: string;
  title: string;
  time: string;
  description?: string;
  completed: boolean;
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimated: number;
  actual?: number;
  paid: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  status: 'pending' | 'confirmed' | 'booked';
  cost?: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: 'pending' | 'confirmed' | 'declined' | 'maybe';
  plusOnes?: number;
  tableNumber?: string;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  image: string;
  attendees?: number;
  organizer?: string;
  isUserInvited?: boolean;
  // New fields
  status: EventStatus;
  phase: EventPhase;
  subEvents?: SubEvent[];
  budget?: {
    total: number;
    items: BudgetItem[];
  };
  vendors?: Vendor[];
  guests?: Guest[];
  media?: MediaItem[];
}
