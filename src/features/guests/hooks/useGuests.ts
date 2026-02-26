import { useCallback, useMemo, useState } from "react";

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
export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age?: number;
  rsvpStatus?: "Going" | "Pending" | "Not Going" | "Not Invited";
  dietaryRestrictions?: string[];
  mealPreference?: string;
}

export interface Guest {
  // Basic Info
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  relation?: string;
  phone?: string;
  email?: string;

  // Extended Info (from RSVP)
  gender?: Gender;
  address?: string;
  location?: string;
  dateOfBirth?: string;

  // Family Info (for confirmed guests)
  familyMembers?: FamilyMember[];
  invitedFamilyMemberIds?: string[]; // Track which family members were invited

  // Status & Category
  status: GuestStatus;
  category?: string;
  invitedAt?: string;
  source: "manual" | "excel" | "contact" | "rsvp";
  createdAt?: string;

  // RSVP Details
  totalGuests?: number;
  dietaryRestrictions?: string[];
  mealPreference?: string;
  hasPlusOne: boolean;
  plusOneName?: string;

  // Event Details
  arrivalDate?: string;
  arrivalLocation?: string;
  departureDate?: string;
  departureLocation?: string;

  // Accommodation & Gifts
  roomAllocation?: string;
  roomType?: string;
  giftStatus?: "Pending" | "Received" | "Not Applicable";
  giftAmount?: number;
  giftMessage?: string;
}

interface UseGuestsReturn {
  // State
  guests: Guest[];
  filteredGuests: Guest[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  selectedInvitation: InvitationStatus;
  setSelectedInvitation: (status: InvitationStatus) => void;
  activeTab: RSVPStatus;
  setActiveTab: (tab: RSVPStatus) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  // Actions
  addGuest: (guest: Omit<Guest, "id">) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  sendInvite: (id: string) => void;
  sendFamilyInvite: (guestId: string, familyMemberIds: string[]) => void;
  updateFamilyMemberRSVP: (
    guestId: string,
    familyMemberId: string,
    rsvpStatus: "Going" | "Pending" | "Not Going" | "Not Invited"
  ) => void;
  refreshGuests: () => void;
  // Stats
  stats: {
    going: number;
    pending: number;
    notGoing: number;
    notInvited: number;
    totalGuests: number;
    invitedGuests: number;
  };
}

export function useGuests(initialGuests: Guest[]): UseGuestsReturn {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [selectedInvitation, setSelectedInvitation] =
    useState<InvitationStatus>("All");
  const [activeTab, setActiveTab] = useState<RSVPStatus>("All");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [refreshing, setRefreshing] = useState(false);

  // Filter and sort logic
  const filteredGuests = useMemo(() => {
    let result = guests.filter((guest) => {
      // Tab filter
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Confirmed" && guest.status === "Going") ||
        (activeTab === "Pending" &&
          (guest.status === "Pending" || guest.status === "Not Going")) ||
        (activeTab === "Not Invited" && guest.status === "Not Invited");

      // Search filter
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone?.includes(searchQuery);

      // Category filter
      const matchesCategory =
        selectedCategory === "All" || guest.relation === selectedCategory;

      // Invitation filter
      const matchesInvitation =
        selectedInvitation === "All" ||
        (selectedInvitation === "Invited" && guest.status !== "Not Invited") ||
        (selectedInvitation === "Not Invited" &&
          guest.status === "Not Invited");

      return (
        matchesTab && matchesSearch && matchesCategory && matchesInvitation
      );
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
          return (b.createdAt || "").localeCompare(a.createdAt || "");
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return result;
  }, [
    guests,
    searchQuery,
    selectedCategory,
    selectedInvitation,
    activeTab,
    sortBy,
  ]);

  // Stats calculation
  const stats = useMemo(() => {
    const going = guests.filter((g) => g.status === "Going").length;
    const pending = guests.filter((g) => g.status === "Pending").length;
    const notGoing = guests.filter((g) => g.status === "Not Going").length;
    const notInvited = guests.filter((g) => g.status === "Not Invited").length;
    const totalGuests = guests.reduce(
      (acc, g) => acc + (g.hasPlusOne ? 2 : 1),
      0
    );
    const invitedGuests = guests.filter(
      (g) => g.status !== "Not Invited"
    ).length;

    return { going, pending, notGoing, notInvited, totalGuests, invitedGuests };
  }, [guests]);

  // Actions
  const addGuest = useCallback((guest: Omit<Guest, "id">) => {
    const newGuest: Guest = {
      ...guest,
      id: Date.now().toString(),
    };
    setGuests((prev) => [...prev, newGuest]);
  }, []);

  const updateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGuest = useCallback((id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const sendInvite = useCallback((id: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status: "Pending" as GuestStatus,
              invitedAt: new Date().toISOString(),
            }
          : g
      )
    );
  }, []);

  // Send invitation to specific family members
  const sendFamilyInvite = useCallback(
    (guestId: string, familyMemberIds: string[]) => {
      setGuests((prev) =>
        prev.map((g) => {
          if (g.id !== guestId) return g;

          // Update invitedFamilyMemberIds
          const existingInvitedIds = g.invitedFamilyMemberIds || [];
          const newInvitedIds = [
            ...new Set([...existingInvitedIds, ...familyMemberIds]),
          ];

          // Update family members' RSVP status
          const updatedFamilyMembers = g.familyMembers?.map((member) => {
            if (familyMemberIds.includes(member.id)) {
              return { ...member, rsvpStatus: "Pending" as const };
            }
            return member;
          });

          return {
            ...g,
            invitedFamilyMemberIds: newInvitedIds,
            familyMembers: updatedFamilyMembers,
            status: "Pending" as GuestStatus,
            invitedAt: g.invitedAt || new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  // Update family member RSVP status
  const updateFamilyMemberRSVP = useCallback(
    (
      guestId: string,
      familyMemberId: string,
      rsvpStatus: "Going" | "Pending" | "Not Going" | "Not Invited"
    ) => {
      setGuests((prev) =>
        prev.map((g) => {
          if (g.id !== guestId) return g;

          const updatedFamilyMembers = g.familyMembers?.map((member) => {
            if (member.id === familyMemberId) {
              return { ...member, rsvpStatus };
            }
            return member;
          });

          return {
            ...g,
            familyMembers: updatedFamilyMembers,
          };
        })
      );
    },
    []
  );

  const refreshGuests = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh - in real app, fetch from API
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return {
    guests,
    filteredGuests,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedInvitation,
    setSelectedInvitation,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    addGuest,
    updateGuest,
    deleteGuest,
    sendInvite,
    sendFamilyInvite,
    updateFamilyMemberRSVP,
    refreshGuests,
    stats,
  };
}
