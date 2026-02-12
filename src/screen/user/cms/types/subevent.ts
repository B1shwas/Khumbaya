import { TemplateActivity } from "@/src/data/subeventTemplates";

export interface SelectedActivity {
  activity: TemplateActivity;
  time: string;
  budget: string;
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

export const VENDOR_CATEGORY_COLORS: Record<string, string> = {
  Music: "#8B5CF6",
  Decoration: "#10B981",
  Food: "#F59E0B",
  Photography: "#EC4899",
  Lighting: "#6366F1",
  Video: "#14B8A6",
  Catering: "#EF4444",
  Florist: "#F97316",
  Makeup: "#D946EF",
  DJ: "#06B6D4",
};

export const RELATIONS = [
  "Family",
  "Friend",
  "Colleague",
  "Neighbor",
  "Relative",
  "Other",
];

export const VENDOR_PLACEHOLDER_IMAGES: Record<string, string> = {
  Music:
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
  Decoration:
    "https://images.unsplash.com/photo-1519225421980-715cb0202128?w=200&h=200&fit=crop",
  Food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop",
  Photography:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
  Lighting:
    "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=200&h=200&fit=crop",
  Video:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=200&fit=crop",
  Catering:
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=200&h=200&fit=crop",
  Florist:
    "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop",
  Makeup:
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
  DJ: "https://images.unsplash.com/photo-1571266028243-3716002dbc84?w=200&h=200&fit=crop",
  default:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
};

export const getVendorPlaceholderImage = (category: string): string => {
  return (
    VENDOR_PLACEHOLDER_IMAGES[category] || VENDOR_PLACEHOLDER_IMAGES.default
  );
};

export const getCategoryColor = (category: string): string => {
  return VENDOR_CATEGORY_COLORS[category] || "#6B7280";
};
