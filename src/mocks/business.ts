import { ROUTES } from "../constants/routes";
import { Business, Operation, Review, Stats } from "../types/business";

export const DUMMY_BUSINESS: Business = {
  id: "1",
  businessName: "Elegant Events & Weddings",
  bio: "We specialize in creating unforgettable weddings and events with a perfect blend of tradition and modern elegance. Our team of experienced professionals ensures every detail is executed flawlessly.",
  location: "New York, NY",
  experience: "8+ years",
  website: "www.eleganteventsweddings.com",
  phone: "(212) 555-1234",
  email: "info@eleganteventsweddings.com",
  instagram: "@eleganteventsweddings",
  facebook: "Elegant Events & Weddings",
  twitter: "@elegantevents",
  whatsapp: "+1 (212) 555-1234",
  rating: 4.8,
  reviewCount: 24,
  verified: true,
  jobsCompleted: 12,
  totalEarnings: 8500,
};

export const DUMMY_REVIEWS: Review[] = [
  {
    id: "1",
    customerName: "Customer 1",
    customerAvatar: "https://randomuser.me/api/portraits/thumb/men/10.jpg",
    rating: 5,
    comment:
      "Great service! The team was professional and delivered exceptional work.",
    date: "2024-01-15",
  },
  {
    id: "2",
    customerName: "Customer 2",
    customerAvatar: "https://randomuser.me/api/portraits/thumb/men/20.jpg",
    rating: 4,
    comment:
      "Beautiful decorations and excellent coordination. Highly recommend.",
    date: "2024-01-10",
  },
  {
    id: "3",
    customerName: "Customer 3",
    customerAvatar: "https://randomuser.me/api/portraits/thumb/men/30.jpg",
    rating: 5,
    comment: "Perfect wedding planning! Everything went smoothly. Thank you!",
    date: "2024-01-05",
  },
];

export const DUMMY_STATS: Stats = {
  jobsCompleted: 12,
  averageRating: 4.8,
  reviewCount: 24,
  totalEarnings: 8500,
};

export const BUSINESS_OPERATIONS: Operation[] = [
  {
    id: "1",
    title: "Services & Pricing",
    icon: "store",
    color: "purple",
    route: ROUTES.SERVICES_PRICING,
  },
  {
    id: "2",
    title: "Portfolio",
    icon: "photo-library",
    color: "pink",
    route: ROUTES.PORTFOLIO,
  },
  {
    id: "3",
    title: "Verification Status",
    icon: "verified",
    color: "green",
    route: ROUTES.VENDOR_VERIFICATION,
  },
  {
    id: "4",
    title: "Full Analytics",
    icon: "trending-up",
    color: "blue",
    route: ROUTES.ANALYTICS,
  },
];
