// Re-export the new GuestListScreen from the features/guests directory
// This maintains backward compatibility while using the new architecture
export { default } from "@/app/(protected)/(client-stack)/events/[eventId]/(guest)/GuestListScreen";

// Also re-export types for backward compatibility
export type {
  CategoryType,
  Guest,
  GuestStatus,
  InvitationStatus,
  RSVPStatus,
  SortOption
} from "@/src/features/guests/hooks/useGuests";

