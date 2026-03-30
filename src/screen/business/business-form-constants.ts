import { BusinessCategory } from "@/src/constants/business";
import { MaterialIcons } from "@expo/vector-icons";

// ─── Vendor → BusinessCategory mapping ───────────────────────────────────────

export const VENDOR_TO_CATEGORY: Record<string, BusinessCategory> = {
  venues: "Venue",
  photographers: "Photographers & Videographer",
  makeup: "Makeup Artist",
  "planning-decor": "Wedding Planners & Decorator",
  "music-dance": "Music & Entertainment",
  food: "Food & Catering",
  "pre-wedding": "Pre Wedding Shoot",
  "bridal-wear": "Bridal Wear",
  jewelry: "Jewelry & Accessories",
  "bridal-grooming": "Bridal Grooming",
  security: "Security Guard",
  "invites-gifts": "Invites & Gift",
  mehendi: "Mehendi Artist",
  baraat: "Baraat",
};

// Reverse mapping: BusinessCategory → vendor slug
export const CATEGORY_TO_VENDOR: Record<string, string> = Object.fromEntries(
  Object.entries(VENDOR_TO_CATEGORY).map(([k, v]) => [v, k])
);

// ─── Vendor category data ────────────────────────────────────────────────────

export interface VendorCategory {
  value: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  subtypes?: string[];
}

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    value: "venues",
    name: "Venues",
    icon: "location-city",
    subtypes: [
      "Banquet Halls",
      "Marriage Garden / Lawns",
      "Wedding Resorts",
      "Small Function / Party Halls",
      "Destination Wedding Venues",
      "Kalyana Mandapams",
      "4 Star & Above Wedding Hotels",
      "Wedding Farmhouses",
    ],
  },
  {
    value: "photographers",
    name: "Photographers",
    icon: "photo-camera",
  },
  {
    value: "makeup",
    name: "Makeup / Bridal Makeup Artists",
    icon: "face",
  },
  {
    value: "planning-decor",
    name: "Planning & Decor",
    icon: "auto-awesome",
    subtypes: ["Wedding Planners", "Decorators", "Mehendi Artists"],
  },
  {
    value: "music-dance",
    name: "Music & Dance",
    icon: "music-note",
    subtypes: ["DJs", "Wedding Entertainment"],
  },
  {
    value: "invites-gifts",
    name: "Invites & Gifts",
    icon: "card-giftcard",
    subtypes: [
      "Invitations",
      "Favors",
      "Invitation Gifts",
      "Mehndi Favors",
    ],
  },
  {
    value: "food",
    name: "Food",
    icon: "restaurant",
    subtypes: ["Catering Services", "Cake", "Chaat & Food Stalls"],
  },
  {
    value: "pre-wedding",
    name: "Pre Wedding Shoot",
    icon: "camera-roll",
  },
  {
    value: "bridal-wear",
    name: "Bridal Wear",
    icon: "checkroom",
    subtypes: [
      "Bridal Lehengas",
      "Kanjeevaram / Silk Sarees",
      "Cocktail Gowns",
      "Trousseau Sarees",
      "Bridal Lehenga on Rent",
    ],
  },
  {
    value: "jewelry",
    name: "Jewelry & Accessories",
    icon: "diamond",
    subtypes: [
      "Jewelry",
      "Flower Jewelry",
      "Bridal Jewelry on Rent",
      "Accessories",
    ],
  },
  {
    value: "bridal-grooming",
    name: "Bridal Grooming",
    icon: "spa",
  },
  {
    value: "security",
    name: "Security Guard",
    icon: "security",
  },
];

// ─── Category dropdown options (top-level only) ──────────────────────────────

export const CATEGORY_OPTIONS = VENDOR_CATEGORIES.map((cat) => ({
  label: cat.name,
  value: cat.value,
}));

// ─── Category-specific field definitions ─────────────────────────────────────

export type FieldType = "text" | "number" | "toggle" | "dropdown";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  unit?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export const CATEGORY_FIELDS: Record<string, FieldConfig[]> = {
  security: [
    { key: "guardsRequired", label: "Number of Guards Required", type: "number", placeholder: "e.g. 5", unit: "guards", icon: "security" },
    { key: "securityFor", label: "Security Required For", type: "dropdown", options: ["VVIP / International Guests", "Politician / Public Figure", "General Event Security"], icon: "security" },
    { key: "guardType", label: "Guard Type", type: "dropdown", options: ["Unarmed", "Armed", "Both Armed & Unarmed"], icon: "security" },
  ],
};

// ─── Form state ───────────────────────────────────────────────────────────────

export interface FormState {
  businessName: string;
  description: string;
  city: string;
  country: string;
  vendorType: string;
  vendorCategoryId: string;
  categoryDetails: Record<string, string | boolean>;
}
