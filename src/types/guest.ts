// Guest Profile Types

export type FoodPreference =
  | "vegetarian"
  | "non_vegetarian"
  | "vegan"
  | "jain"
  | "kosher"
  | "halal"
  | "other";

export type IdentityProofType =
  | "passport"
  | "driving_license"
  | "national_id"
  | "aadhar"
  | "voter_id"
  | "other";

export type RelationType =
  | "self"
  | "spouse"
  | "child"
  | "parent"
  | "sibling"
  | "other";

export interface IdentityProof {
  type: IdentityProofType;
  number: string;
  documentUri?: string; // URI for uploaded document
}

export interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: RelationType;
  foodPreference: FoodPreference;
  identity: IdentityProof;
  dateOfBirth?: string;
  isAdult: boolean;
}

export interface GuestProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  foodPreference: FoodPreference;
  identity: IdentityProof;
  dateOfBirth?: string;
  familyMembers: FamilyMember[];
  totalPax: number;
  adultCount: number;
  kidCount: number;
  roomAllocation?: {
    allocated: boolean;
    roomNumber?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Form types for creating/editing
export interface GuestProfileFormData {
  name: string;
  phone: string;
  email: string;
  foodPreference: FoodPreference;
  identity: IdentityProof;
  dateOfBirth?: string;
}

export interface FamilyMemberFormData {
  name: string;
  phone: string;
  email: string;
  relation: RelationType;
  foodPreference: FoodPreference;
  identity: IdentityProof;
  dateOfBirth?: string;
  isAdult: boolean;
}

// API Response types
export interface GuestProfileResponse {
  success: boolean;
  data: GuestProfile;
  message?: string;
}

export interface FamilyMemberResponse {
  success: boolean;
  data: FamilyMember;
  message?: string;
}

export interface GuestProfileListResponse {
  success: boolean;
  data: GuestProfile[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Food preference display labels
export const FOOD_PREFERENCE_LABELS: Record<FoodPreference, string> = {
  vegetarian: "Vegetarian",
  non_vegetarian: "Non-Vegetarian",
  vegan: "Vegan",
  jain: "Jain",
  kosher: "Kosher",
  halal: "Halal",
  other: "Other",
};

// Identity proof type labels
export const IDENTITY_PROOF_LABELS: Record<IdentityProofType, string> = {
  passport: "Passport",
  driving_license: "Driving License",
  national_id: "National ID",
  aadhar: "Aadhar Card",
  voter_id: "Voter ID",
  other: "Other",
};

// Relation type labels
export const RELATION_LABELS: Record<RelationType, string> = {
  self: "Self",
  spouse: "Spouse",
  child: "Child",
  parent: "Parent",
  sibling: "Sibling",
  other: "Other",
};
