// Guest Types
// ============================================

export type RSVPStatus = "All" | "Confirmed" | "Pending" | "Not Invited";
export type GuestStatus = "Going" | "Pending" | "Not Going" | "Not Invited";
export type CategoryType =
  | "All"
  | "Family"
  | "Friend"
  | "Colleague"
  | "Relative"
  | "Neighbor"
  | "Other";
export type InvitationStatus = "All" | "Invited" | "Not Invited";
export type SortOption = "name" | "recent" | "status";
export type GuestSource = "manual" | "excel" | "contact";

export interface Guest {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  relation?: string;
  phone?: string;
  email?: string;
  dietaryRestrictions?: string[];
  hasPlusOne: boolean;
  plusOneName?: string;
  status: GuestStatus;
  category?: string;
  invitedAt?: string;
  source: GuestSource;
  createdAt?: string;
}

// Guest Form Types
export interface GuestFormData {
  name: string;
  email?: string;
  phone?: string;
  relation?: string;
  dietaryRestrictions?: string[];
  hasPlusOne: boolean;
  plusOneName?: string;
}

export interface AddGuestFormData {
  name: string;
  email?: string;
  phone?: string;
  relation?: string;
}

// Filter Types
export interface GuestFilters {
  searchQuery: string;
  selectedCategory: CategoryType;
  selectedInvitation: InvitationStatus;
  sortBy: SortOption;
  activeTab: RSVPStatus;
}

// Stats Types
export interface GuestStats {
  going: number;
  pending: number;
  notGoing: number;
  notInvited: number;
  totalGuests: number;
  invitedGuests: number;
}

// API Response Types
export interface GuestApiResponse {
  guests: Guest[];
  total: number;
  page: number;
  limit: number;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors?: string[];
}
