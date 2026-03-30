export type BusinessCategory =
  | "Venue"
  | "Photographers & Videographer"
  | "Makeup Artist"
  | "Bridal Grooming"
  | "Mehendi Artist"
  | "Wedding Planners & Decorator"
  | "Music & Entertainment"
  | "Invites & Gift"
  | "Food & Catering"
  | "Pre Wedding Shoot"
  | "Bridal Wear"
  | "Jewelry & Accessories"
  | "Security Guard"
  | "Baraat";

export interface BusinessService {
  id: string;
  title: string;
  price: string;
  description: string;
  iconName: string;
}

export interface BusinessRequest {
  id: string;
  clientName: string;
  clientAvatarUrl: string;
  date: string;
  eventType: string;
  status: "pending" | "confirmed" | "rejected";
}

export interface BusinessReview {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl: string;
  rating: number;
  quote: string;
  date: string;
}

export interface Business {
  id: number;
  business_name: string;
  type: string | null;
  category: BusinessCategory | null;
  avatar: string | null;
  cover: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  legal_document: string | null;
  is_verified: boolean;
  owner_id: number;
  description: string | null;
  price_starting_from: number | null;
  years_of_experience: number | null;
  team_size: number | null;
  service_area: string | null;
  contact_person_name: string | null;
  contact_phone: string | null;
  website_url: string | null;
  instagram_url: string | null;
  whatsapp_number: string | null;
  provides_home_service: boolean;
  travel_policy: string | null;
  cancellation_policy: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional stats (from separate endpoints)
  rating?: number | null;
  upcomingEvents?: number;
  totalBookings?: number;
  totalEarnings?: string;
  profileViews?: number;
  // Optional detail fields (from detail endpoint)
  services?: BusinessService[];
  portfolio?: string[];
  requests?: BusinessRequest[];
  reviews?: BusinessReview[];
  availabilityDates?: {
    booked: number[];
    pending: number[];
  };
}

