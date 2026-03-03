import {
  SubEventTemplate,
  TemplateActivity,
} from "../constants/subeventTemplates";

export interface SelectedActivity {
  activity: TemplateActivity;
  time: string;
  budget: string;
}

export interface SelectedSubEvent {
  template: SubEventTemplate;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
}

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

export type {
  SubEventTemplate,
  TemplateActivity,
} from "../constants/subeventTemplates";

// ─── Guest Event Portal ────────────────────────────────────────────────────

export interface EventHighlight {
  id: string;
  /** Display title, e.g. "Welcome Brunch" */
  title: string;
  /** Pre-formatted label, e.g. "Oct 24 • 11:00 AM • Poolside Deck" */
  dateLabel: string;
  /** Ionicons icon name */
  icon: string;
  /** Renders the filled primary dot (last / main event) */
  isFinal?: boolean;
}

export interface EventService {
  id: string;
  label: string;
  /** Ionicons icon name */
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
