/**
 * Vendor Type Configuration
 * Central configuration for all vendor types - DRY Principle
 * Each vendor type defines its specific fields, steps, and setup requirements
 */

// Re-export vendor types
export const VENDOR_TYPES = {
  venue: {
    id: "venue",
    label: "Venue",
    icon: "castle",
    description: "Wedding venues, banquet halls, farms, resorts",
    color: "#8b5cf6",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "capacity", title: "Capacity", icon: "people" },
      { id: "amenities", title: "Amenities", icon: "star" },
      { id: "pricing", title: "Pricing", icon: "attach-money" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "services", title: "Services", icon: "room-service" },
      { id: "events", title: "Events", icon: "celebration" },
      { id: "rules", title: "Rules", icon: "policy" },
      { id: "booking", title: "Booking", icon: "event-available" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
  photographer: {
    id: "photographer",
    label: "Photographer",
    icon: "photo-camera",
    description: "Photo & video services for weddings",
    color: "#ec4899",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "equipment", title: "Equipment", icon: "camera" },
      { id: "style", title: "Style", icon: "brush" },
      { id: "packages", title: "Packages", icon: "sell" },
      { id: "portfolio", title: "Portfolio", icon: "photo-library" },
      { id: "team", title: "Team", icon: "groups" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "terms", title: "Terms", icon: "description" },
      { id: "booking", title: "Booking", icon: "event-available" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
  caterer: {
    id: "caterer",
    label: "Caterer",
    icon: "restaurant",
    description: "Food & beverage services",
    color: "#f59e0b",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "cuisine", title: "Cuisine", icon: "restaurant-menu" },
      { id: "services", title: "Services", icon: "room-service" },
      { id: "menu", title: "Menu", icon: "menu-book" },
      { id: "pricing", title: "Pricing", icon: "attach-money" },
      { id: "staff", title: "Staff", icon: "groups" },
      { id: "equipment", title: "Equipment", icon: "kitchen" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "terms", title: "Terms", icon: "description" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
  decorator: {
    id: "decorator",
    label: "Decorator",
    icon: "local-florist",
    description: "Decor & floral arrangements",
    color: "#10b981",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "style", title: "Style", icon: "brush" },
      { id: "services", title: "Services", icon: "auto-awesome" },
      { id: "portfolio", title: "Portfolio", icon: "photo-library" },
      { id: "packages", title: "Packages", icon: "sell" },
      { id: "team", title: "Team", icon: "groups" },
      { id: "pricing", title: "Pricing", icon: "attach-money" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "terms", title: "Terms", icon: "description" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
  makeup: {
    id: "makeup",
    label: "Makeup Artist",
    icon: "face-retouching-natural",
    description: "Bridal & party makeup services",
    color: "#ef4444",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "services", title: "Services", icon: "spa" },
      { id: "skills", title: "Skills", icon: "brush" },
      { id: "portfolio", title: "Portfolio", icon: "photo-library" },
      { id: "packages", title: "Packages", icon: "sell" },
      { id: "products", title: "Products", icon: "inventory" },
      { id: "pricing", title: "Pricing", icon: "attach-money" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "terms", title: "Terms", icon: "description" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
  dj: {
    id: "dj",
    label: "DJ / Music",
    icon: "music-note",
    description: "Music & entertainment services",
    color: "#3b82f6",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "equipment", title: "Equipment", icon: "speaker" },
      { id: "services", title: "Services", icon: "headphones" },
      { id: "genres", title: "Genres", icon: "queue-music" },
      { id: "packages", title: "Packages", icon: "sell" },
      { id: "experience", title: "Experience", icon: "star" },
      { id: "pricing", title: "Pricing", icon: "attach-money" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "terms", title: "Terms", icon: "description" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
  planner: {
    id: "planner",
    label: "Planner",
    icon: "edit-note",
    description: "Event planning & coordination",
    color: "#6366f1",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "expertise", title: "Expertise", icon: "psychology" },
      { id: "services", title: "Services", icon: "list-alt" },
      { id: "portfolio", title: "Portfolio", icon: "photo-library" },
      { id: "packages", title: "Packages", icon: "sell" },
      { id: "team", title: "Team", icon: "groups" },
      { id: "pricing", title: "Pricing", icon: "attach-money" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "terms", title: "Terms", icon: "description" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
  transport: {
    id: "transport",
    label: "Transport",
    icon: "directions-car",
    description: "Transportation services",
    color: "#14b8a6",
    steps: [
      { id: "basic", title: "Basic Info", icon: "business" },
      { id: "fleet", title: "Fleet", icon: "directions-car" },
      { id: "services", title: "Services", icon: "local-shipping" },
      { id: "packages", title: "Packages", icon: "sell" },
      { id: "pricing", title: "Pricing", icon: "attach-money" },
      { id: "drivers", title: "Drivers", icon: "person" },
      { id: "coverage", title: "Coverage", icon: "map" },
      { id: "availability", title: "Availability", icon: "schedule" },
      { id: "terms", title: "Terms", icon: "description" },
      { id: "verification", title: "Verification", icon: "verified" },
    ],
  },
} as const;

export type VendorTypeId = keyof typeof VENDOR_TYPES;

// Common fields that all vendors need
export interface CommonVendorFields {
  // Identity
  ownerName: string;
  email: string;
  phone: string;
  profilePhoto: string;
  
  // Business
  businessName: string;
  bio: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  
  // Experience
  experience: string;
  establishedYear: string;
  
  // Social
  website: string;
  instagram: string;
  facebook: string;
  
  // Verification
  verification: {
    idProof: boolean;
    businessLicense: boolean;
    bankDetails: boolean;
    status: "pending" | "approved" | "rejected";
  };
  
  // Setup
  setupComplete: boolean;
  updatedAt: string;
}

// Get vendor type by ID
export const getVendorType = (id: string) => {
  return VENDOR_TYPES[id as VendorTypeId] || null;
};

// Get all vendor types as array
export const getAllVendorTypes = () => {
  return Object.values(VENDOR_TYPES);
};

// Storage keys - DRY principle
export const STORAGE_KEYS = {
  BUSINESS_INFO: "business_info",
  VENUE_DATA: "venue_data",
  PHOTOGRAPHER_DATA: "photographer_data",
  CATERER_DATA: "caterer_data",
  DECORATOR_DATA: "decorator_data",
  MAKEUP_DATA: "makeup_data",
  DJ_DATA: "dj_data",
  PLANNER_DATA: "planner_data",
  TRANSPORT_DATA: "transport_data",
  PORTFOLIO: "portfolio",
  VENDOR_SETUP_COMPLETE: "vendor_setup_complete",
};

// Get storage key for vendor type
export const getVendorStorageKey = (vendorType: string): string => {
  const keyMap: Record<string, string> = {
    venue: STORAGE_KEYS.VENUE_DATA,
    photographer: STORAGE_KEYS.PHOTOGRAPHER_DATA,
    caterer: STORAGE_KEYS.CATERER_DATA,
    decorator: STORAGE_KEYS.DECORATOR_DATA,
    makeup: STORAGE_KEYS.MAKEUP_DATA,
    dj: STORAGE_KEYS.DJ_DATA,
    planner: STORAGE_KEYS.PLANNER_DATA,
    transport: STORAGE_KEYS.TRANSPORT_DATA,
  };
  return keyMap[vendorType] || STORAGE_KEYS.BUSINESS_INFO;
};
