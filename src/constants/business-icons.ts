import type { BusinessCategory } from "./business";
import type { MaterialIcons } from "@expo/vector-icons";

export const CATEGORY_ICONS: Record<
  BusinessCategory,
  keyof typeof MaterialIcons.glyphMap
> = {
  Venue: "location-city",
  "Photographers & Videographer": "photo-camera",
  "Makeup Artist": "face",
  "Bridal Grooming": "spa",
  "Mehendi Artist": "brush",
  "Wedding Planners & Decorator": "auto-awesome",
  "Music & Entertainment": "music-note",
  "Invites & Gift": "card-giftcard",
  "Food & Catering": "restaurant",
  "Pre Wedding Shoot": "camera-roll",
  "Bridal Wear": "checkroom",
  "Jewelry & Accessories": "diamond",
  "Security Guard": "security",
  Baraat: "celebration",
};

export function getBusinessIcon(
  category?: BusinessCategory
): keyof typeof MaterialIcons.glyphMap {
  if (!category) return "storefront";
  return CATEGORY_ICONS[category] ?? "storefront";
}
