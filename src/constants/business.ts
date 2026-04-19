export enum BusinessCategory {
  Venue = "Venue",
  PhotographerVideographer = "Photographers & Videographer",
  MakeupArtist = "Makeup Artist",
  BridalGrooming = "Bridal Grooming",
  MehendiArtist = "Mehendi Artist",
  WeddingPlannersDecorator = "Wedding Planners & Decorator",
  MusicEntertainment = "Music & Entertainment",
  InvitesGift = "Invites & Gift",
  FoodCatering = "Food & Catering",
  PreWeddingShoot = "Pre Wedding Shoot",
  BridalWear = "Bridal Wear",
  JewelryAccessories = "Jewelry & Accessories",
  SecurityGuard = "Security Guard",
  Baraat = "Baraat"
}

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

// ─── Category-specific attribute schemas ──────────────────────────────────────

export interface VenueAttribute {
  venue_id: number;
  business_id: number;
  venue_name: string | null;
  venue_type: string | null;
  capacity: number | null;
  area_sqft: number | null;
  min_booking_hours: number | null;
  max_booking_hours: number | null;
  has_catering: boolean;
  has_av_equipment: boolean;
  is_outDoor: boolean;
  price_per_hour: number | null;
  parking: boolean;
  rooms_available: number | null;
  valet_available: boolean;
  alcohol_allowed: boolean;
  sound_limit_db: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface OtherServiceAttribute {
  id: number;
  business_id: number;
  artist_type: string | null;
  styles_specialized: string | null;
  max_bookings_per_day: number | null;
  advance_amount: number | null;
  uses_own_material: boolean;
  travel_charges: number | null;
  portfolio_link: string | null;
  available_for_destination: boolean;
  customization_available: boolean;
  serves_veg: boolean;
  min_order: number | null;
  createdAt: string;
  updatedAt: string;
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
  email: string | null;
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
export interface BusinessWithAttribute {
  business_information: Business,
  venue_information: VenueAttribute[],
  vendor_services_information: OtherServiceAttribute[]
}

// ─── Mock constants for category-specific details ─────────────────────────────

export const MOCK_VENUE_ATTRIBUTES: VenueAttribute[] = [
  {
    venue_id: 1,
    business_id: 1,
    venue_name: null,
    venue_type: "Banquet Hall",
    capacity: 500,
    area_sqft: 4200,
    min_booking_hours: 4,
    max_booking_hours: 12,
    has_catering: true,
    has_av_equipment: true,
    is_outDoor: false,
    price_per_hour: 8000,
    parking: true,
    rooms_available: 8,
    valet_available: true,
    alcohol_allowed: true,
    sound_limit_db: 85,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    venue_id: 2,
    business_id: 1,
    venue_name: null,
    venue_type: "Lawn / Garden",
    capacity: 800,
    area_sqft: 9000,
    min_booking_hours: 6,
    max_booking_hours: 16,
    has_catering: true,
    has_av_equipment: false,
    is_outDoor: true,
    price_per_hour: 12000,
    parking: true,
    rooms_available: 2,
    valet_available: false,
    alcohol_allowed: false,
    sound_limit_db: 70,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    venue_id: 3,
    business_id: 1,
    venue_name: null,
    venue_type: "Rooftop Terrace",
    capacity: 200,
    area_sqft: 2800,
    min_booking_hours: 3,
    max_booking_hours: 8,
    has_catering: false,
    has_av_equipment: true,
    is_outDoor: true,
    price_per_hour: 6500,
    parking: false,
    rooms_available: null,
    valet_available: true,
    alcohol_allowed: true,
    sound_limit_db: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const MOCK_SERVICE_ATTRIBUTE: OtherServiceAttribute = {
  id: 1,
  business_id: 1,
  artist_type: "Traditional & Contemporary",
  styles_specialized: "Bridal, Editorial, SFX",
  max_bookings_per_day: 3,
  advance_amount: 5000,
  uses_own_material: true,
  travel_charges: 500,
  portfolio_link: "https://portfolio.example.com",
  available_for_destination: true,
  customization_available: true,
  serves_veg: false,
  min_order: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};
