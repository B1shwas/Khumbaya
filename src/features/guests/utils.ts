// Guest Utilities
// ============================================

import { GUEST_COLORS, SOURCE_COLORS } from "./constants";
import type {
    CategoryType,
    Guest,
    GuestFilters,
    GuestStats,
    SortOption,
} from "./types";

// Status Color Functions
export const getStatusColor = (status: Guest["status"]): string => {
  switch (status) {
    case "Going":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "Pending":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    case "Not Going":
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    case "Not Invited":
      return "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const getStatusBgColor = (status: Guest["status"]): string => {
  switch (status) {
    case "Going":
      return GUEST_COLORS.going.bg;
    case "Pending":
      return GUEST_COLORS.pending.bg;
    case "Not Going":
      return GUEST_COLORS.notGoing.bg;
    default:
      return GUEST_COLORS.notInvited.bg;
  }
};

// Source Info Function
export const getSourceInfo = (source: Guest["source"]) => {
  return SOURCE_COLORS[source];
};

// Generate Initials
export const generateInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Filter Guests
export const filterGuests = (
  guests: Guest[],
  filters: GuestFilters,
): Guest[] => {
  return guests.filter((guest) => {
    const matchesTab =
      filters.activeTab === "All" ||
      (filters.activeTab === "Confirmed" && guest.status === "Going") ||
      (filters.activeTab === "Pending" &&
        (guest.status === "Pending" || guest.status === "Not Going")) ||
      (filters.activeTab === "Not Invited" && guest.status === "Not Invited");

    const matchesSearch = guest.name
      .toLowerCase()
      .includes(filters.searchQuery.toLowerCase());

    const matchesCategory =
      filters.selectedCategory === "All" ||
      guest.relation === filters.selectedCategory;

    const matchesInvitation =
      filters.selectedInvitation === "All" ||
      (filters.selectedInvitation === "Invited" &&
        guest.status !== "Not Invited") ||
      (filters.selectedInvitation === "Not Invited" &&
        guest.status === "Not Invited");

    return matchesTab && matchesSearch && matchesCategory && matchesInvitation;
  });
};

// Sort Guests
export const sortGuests = (guests: Guest[], sortBy: SortOption): Guest[] => {
  return [...guests].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "recent") {
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    } else {
      return a.status.localeCompare(b.status);
    }
  });
};

// Calculate Stats
export const calculateStats = (guests: Guest[]): GuestStats => {
  const goingCount = guests.filter((g) => g.status === "Going").length;
  const pendingCount = guests.filter((g) => g.status === "Pending").length;
  const notGoingCount = guests.filter((g) => g.status === "Not Going").length;
  const notInvitedCount = guests.filter(
    (g) => g.status === "Not Invited",
  ).length;
  const totalGuests = guests.reduce(
    (acc, g) => acc + (g.hasPlusOne ? 2 : 1),
    0,
  );
  const invitedGuests = guests.filter((g) => g.status !== "Not Invited").length;

  return {
    going: goingCount,
    pending: pendingCount,
    notGoing: notGoingCount,
    notInvited: notInvitedCount,
    totalGuests,
    invitedGuests,
  };
};

// Extract Categories from Guests
export const extractCategories = (
  guests: Guest[],
  allOption: CategoryType = "All",
): CategoryType[] => {
  const categories = new Set<CategoryType>();
  categories.add(allOption);

  guests.forEach((guest) => {
    if (guest.relation) {
      categories.add(guest.relation as CategoryType);
    }
  });

  return Array.from(categories);
};

// Create Guest from Form Data
export const createGuestFromForm = (formData: {
  name: string;
  relation?: string;
  phone?: string;
  email?: string;
}): Guest => {
  return {
    id: Date.now().toString(),
    name: formData.name.trim(),
    initials: generateInitials(formData.name),
    relation: formData.relation || undefined,
    phone: formData.phone || undefined,
    email: formData.email || undefined,
    hasPlusOne: false,
    status: "Not Invited",
    source: "manual",
    createdAt: new Date().toISOString().split("T")[0],
  };
};

// Validate Guest Form
export const validateGuestForm = (formData: {
  name: string;
}): { isValid: boolean; error?: string } => {
  if (!formData.name.trim()) {
    return { isValid: false, error: "Guest name is required" };
  }
  return { isValid: true };
};
