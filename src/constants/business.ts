export type BusinessStatus = "active" | "pending";

export interface Business {
  id: string;
  name: string;
  imageUrl: string;
  status: BusinessStatus;
  rating: number | null;
  upcomingEvents: number;
}

export const BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Radiant Moments Photography",
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    status: "active",
    rating: 4.9,
    upcomingEvents: 12,
  },
  {
    id: "2",
    name: "Velvet Decor & Design",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    status: "pending",
    rating: null,
    upcomingEvents: 3,
  },
];
