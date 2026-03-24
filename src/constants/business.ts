export type BusinessStatus = "active" | "pending";

export type BusinessCategory =
  | "photography"
  | "videography"
  | "decor"
  | "catering"
  | "music"
  | "venue"
  | "makeup"
  | "florist"
  | "wedding-planning"
  | "other";

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
  id: string;
  name: string;
  description?: string;
  category?: BusinessCategory;
  imageUrl: string;
  status: BusinessStatus;
  rating: number | null;
  upcomingEvents: number;
  // Detail screen fields (optional)
  location?: string;
  priceTier?: "$" | "$$" | "$$$" | "$$$$";
  coverImageUrl?: string;
  totalBookings?: number;
  totalEarnings?: string;
  profileViews?: number;
  profileCompletion?: number;
  services?: BusinessService[];
  portfolio?: string[];
  requests?: BusinessRequest[];
  reviews?: BusinessReview[];
  availabilityDates?: {
    booked: number[];
    pending: number[];
  };
}

export const BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Radiant Moments Photography",
    category: "photography",
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    status: "active",
    rating: 4.9,
    upcomingEvents: 12,
    location: "Kathmandu, Nepal",
    priceTier: "$$$",
    coverImageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    totalBookings: 156,
    totalEarnings: "$24.5k",
    profileViews: 1200,
    profileCompletion: 70,
    services: [
      {
        id: "s1",
        title: "Pre-Wedding Shoot",
        price: "From $500",
        description: "4 hours, 50 edited photos, 1 location",
        iconName: "photo-camera",
      },
      {
        id: "s2",
        title: "Full Wedding Day",
        price: "From $2,500",
        description: "12 hours, 300+ edited photos, 2 photographers",
        iconName: "auto-awesome",
      },
      {
        id: "s3",
        title: "Portrait Session",
        price: "From $299",
        description: "2 hours studio session, 30 edited photos",
        iconName: "person",
      },
      {
        id: "s4",
        title: "Event Coverage",
        price: "From $799",
        description: "Up to 6 hours, 100+ edited photos",
        iconName: "event",
      },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
      "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=400&q=70",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=70",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=70",
      "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?w=400&q=70",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70",
    ],
    requests: [
      {
        id: "r1",
        clientName: "Priya Sharma",
        clientAvatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        date: "Dec 15, 2024",
        eventType: "Pre-Wedding Shoot",
        status: "pending",
      },
      {
        id: "r2",
        clientName: "Aarav Mehta",
        clientAvatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        date: "Dec 24, 2024",
        eventType: "Full Wedding Day",
        status: "confirmed",
      },
    ],
    reviews: [
      {
        id: "rv1",
        reviewerName: "Priya K.",
        reviewerAvatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        rating: 5,
        quote:
          "The pictures are absolutely breathtaking! Radiant Moments captured every emotion perfectly.",
        date: "Nov 2024",
      },
    ],
    availabilityDates: {
      booked: [3, 8, 14, 20, 24],
      pending: [10, 17, 25],
    },
  },
  {
    id: "2",
    name: "Velvet Decor & Design",
    category: "decor",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    status: "pending",
    rating: null,
    upcomingEvents: 3,
    location: "Pokhara, Nepal",
    priceTier: "$$",
    coverImageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    totalBookings: 0,
    totalEarnings: "$0",
    profileViews: 48,
    profileCompletion: 40,
    services: [],
    portfolio: [],
    requests: [],
    reviews: [],
    availabilityDates: { booked: [], pending: [] },
  },
];
