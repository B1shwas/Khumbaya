// useGuests Hook
// ============================================

import { useCallback, useMemo, useReducer } from "react";
import type {
    AddGuestFormData,
    CategoryType,
    Guest,
    GuestFilters,
    GuestStats,
    InvitationStatus,
    RSVPStatus,
    SortOption,
} from "../types";
import {
    calculateStats,
    createGuestFromForm,
    extractCategories,
    filterGuests,
    sortGuests,
} from "../utils";

// Sample data for initial state
const initialGuestsData: Guest[] = [
  {
    id: "1",
    name: "Priya Sharma",
    initials: "PS",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB--T3hlmaUPe1nkyPSaDvWNywMflSEaIln6Jd_fxEzHVDNZiNn9LaiQ3LPJ10P7zUj_RmcaoL0L-hYsdQD0pZX2z0j0mVCNO1JXLTfoE14txTsMBcs2reltFdX6m6Zp79e_aJ9gby2EeYq89l3QPJp397ulpBoFF74LIn3cDC6Kq9K0-7oG5duAlrEhpI_j1tdOJfZo2e0zraD5BzK49gOhgOoXgNxYbX5jr83XTgDztLMNXfabWaS-4g2ZhwxDe8DvDHd4VrVDNE",
    relation: "Friend",
    phone: "+91 98765 43210",
    dietaryRestrictions: ["Vegetarian"],
    hasPlusOne: true,
    status: "Going",
    category: "Groom's Colleague",
    source: "manual",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Rahul Kapoor",
    initials: "RK",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASp_dQWEiTm4HrOaD1W0IvYQR5RNkVUT07upBDZTNy-pWGqVRsE9i-ZWenPB55z9CAZCO_jr73ikPbuX2LUksvn-oy5wSFJM8HGogVb294eWJ1VGRUMsgks-Q2bor1M5Neja5eRWvRLgJ-u6Gj_Sj8HYOuvf_HBo3Z8A46DMtg-srQALATZNUHJu0uVSh4SYjG1LKHarCbLZJaVn3nWY9qqeHQiGAPgseDUmw9Q-0GFFS1kLRlkkIR7nMVBVgRLOHryFbbqdiD3Yw",
    relation: "Family",
    phone: "+91 98765 43211",
    hasPlusOne: false,
    status: "Going",
    category: "Bride's Family",
    source: "manual",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Sarah Jenkins",
    initials: "SJ",
    relation: "Friend",
    phone: "+1 555-123-4567",
    dietaryRestrictions: ["Gluten-free"],
    hasPlusOne: false,
    status: "Pending",
    category: "Bride's Friend",
    source: "excel",
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    name: "Mike Ross",
    initials: "MR",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDFZsiIRYoBahyVsWDta69-bveLb9zIX5oaxyp7a0WhEkGUvNd_DMHtPWpWQOqHq8ND7K5V2rGVQ_a5yQbiofEB10Ka1_E3KMysdk7TrJ96MpNpeh1bExor1hQZTDiBegkduy-Y4-HWKv6LAIj-vJd12tQZ8nVy4IGl7OmosSPxWUhpQkG7KjvaMRMB3nutFOivg5_tV8uAkow4TDGYXCn3BZOT7FgUSmkk8ejLH44WZrhxcovUhpuOWSJQsYncl-44aFePDR-4sM",
    relation: "Colleague",
    phone: "+1 555-234-5678",
    hasPlusOne: true,
    status: "Not Going",
    category: "Groom's Colleague",
    source: "contact",
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    name: "Amara Singh",
    initials: "AS",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdMA7i_1GDWxSQ3hJ960VCgcMZczNnTmaSXHfq8jAJTiubUL0hAsY_q3a-GvCqhVmRX1fxmE9o4regPfn2oSd3RTUYFCR7dotbtmdYHlT-5J-0EB6WPy2eDjylVrL-BNY8FdR1UK3eMZRM8K9KrE2_qzV4jvIyZ9RGis8zvc6nhFl5oBQOSN4fiPhrg-1X_yAF4epzSeiRLV7by04RWs2Zx1_QH9-_gzD7CWdLpFaTetTCQG-t600CNnDC1PJ_EufnZfyxPhWhhr8",
    relation: "Family",
    phone: "+91 98765 43212",
    dietaryRestrictions: ["Vegan", "Nut allergy"],
    hasPlusOne: false,
    status: "Going",
    category: "Groom's Family",
    source: "manual",
    createdAt: "2024-01-12",
  },
  {
    id: "6",
    name: "James Wilson",
    initials: "JW",
    relation: "Neighbor",
    phone: "+1 555-345-6789",
    hasPlusOne: false,
    status: "Not Invited",
    category: "Neighbor",
    source: "manual",
    createdAt: "2024-01-22",
  },
  {
    id: "7",
    name: "Emily Brown",
    initials: "EB",
    relation: "Friend",
    phone: "+1 555-456-7890",
    hasPlusOne: true,
    status: "Pending",
    category: "Bride's Friend",
    source: "excel",
    createdAt: "2024-01-25",
  },
  {
    id: "8",
    name: "David Lee",
    initials: "DL",
    relation: "Colleague",
    phone: "+1 555-567-8901",
    hasPlusOne: false,
    status: "Going",
    category: "Groom's Colleague",
    source: "manual",
    createdAt: "2024-01-08",
  },
];

// State Types
interface GuestState {
  guests: Guest[];
  isLoading: boolean;
  isImporting: boolean;
  error: string | null;
  filters: GuestFilters;
  formData: AddGuestFormData;
  showAddModal: boolean;
  showFilterSidebar: boolean;
  showSortOptions: boolean;
}

// Action Types
type GuestAction =
  | { type: "SET_GUESTS"; payload: Guest[] }
  | { type: "ADD_GUEST"; payload: Guest }
  | { type: "UPDATE_GUEST"; payload: { id: string; updates: Partial<Guest> } }
  | { type: "DELETE_GUEST"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_IMPORTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FILTER"; payload: Partial<GuestFilters> }
  | { type: "RESET_FILTERS" }
  | { type: "SET_FORM_DATA"; payload: Partial<AddGuestFormData> }
  | { type: "RESET_FORM_DATA" }
  | { type: "TOGGLE_ADD_MODAL" }
  | { type: "TOGGLE_FILTER_SIDEBAR" }
  | { type: "TOGGLE_SORT_OPTIONS" };

// Initial State
const initialState: GuestState = {
  guests: initialGuestsData,
  isLoading: false,
  isImporting: false,
  error: null,
  filters: {
    searchQuery: "",
    selectedCategory: "All",
    selectedInvitation: "All",
    sortBy: "name",
    activeTab: "All",
  },
  formData: {
    name: "",
    email: "",
    phone: "",
    relation: "",
  },
  showAddModal: false,
  showFilterSidebar: false,
  showSortOptions: false,
};

// Reducer
const guestReducer = (state: GuestState, action: GuestAction): GuestState => {
  switch (action.type) {
    case "SET_GUESTS":
      return { ...state, guests: action.payload };
    case "ADD_GUEST":
      return { ...state, guests: [...state.guests, action.payload] };
    case "UPDATE_GUEST":
      return {
        ...state,
        guests: state.guests.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.updates } : g,
        ),
      };
    case "DELETE_GUEST":
      return {
        ...state,
        guests: state.guests.filter((g) => g.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_IMPORTING":
      return { ...state, isImporting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
      };
    case "SET_FORM_DATA":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    case "RESET_FORM_DATA":
      return {
        ...state,
        formData: initialState.formData,
      };
    case "TOGGLE_ADD_MODAL":
      return { ...state, showAddModal: !state.showAddModal };
    case "TOGGLE_FILTER_SIDEBAR":
      return { ...state, showFilterSidebar: !state.showFilterSidebar };
    case "TOGGLE_SORT_OPTIONS":
      return { ...state, showSortOptions: !state.showSortOptions };
    default:
      return state;
  }
};

// Hook Return Type
interface UseGuestsReturn {
  // State
  guests: Guest[];
  isLoading: boolean;
  isImporting: boolean;
  error: string | null;
  showAddModal: boolean;
  showFilterSidebar: boolean;
  showSortOptions: boolean;
  filters: GuestFilters;
  formData: AddGuestFormData;

  // Computed
  stats: GuestStats;
  filteredGuests: Guest[];
  categories: CategoryType[];

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: CategoryType) => void;
  setSelectedInvitation: (status: InvitationStatus) => void;
  setSortBy: (sort: SortOption) => void;
  setActiveTab: (tab: RSVPStatus) => void;
  setFormData: (data: Partial<AddGuestFormData>) => void;
  toggleAddModal: () => void;
  toggleFilterSidebar: () => void;
  toggleSortOptions: () => void;
  resetFilters: () => void;
  resetFormData: () => void;
  addGuest: (formData: AddGuestFormData) => void;
  updateGuestStatus: (id: string, status: Guest["status"]) => void;
  sendInvite: (id: string) => void;
  refresh: () => Promise<void>;
}

// Custom Hook
export const useGuests = (): UseGuestsReturn => {
  const [state, dispatch] = useReducer(guestReducer, initialState);

  // Computed values
  const stats = useMemo(() => calculateStats(state.guests), [state.guests]);

  const filteredGuests = useMemo(() => {
    const filtered = filterGuests(state.guests, state.filters);
    return sortGuests(filtered, state.filters.sortBy);
  }, [state.guests, state.filters]);

  const categories = useMemo(
    () => extractCategories(state.guests),
    [state.guests],
  );

  // Filter setters
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_FILTER", payload: { searchQuery: query } });
  }, []);

  const setSelectedCategory = useCallback((category: CategoryType) => {
    dispatch({ type: "SET_FILTER", payload: { selectedCategory: category } });
  }, []);

  const setSelectedInvitation = useCallback((status: InvitationStatus) => {
    dispatch({ type: "SET_FILTER", payload: { selectedInvitation: status } });
  }, []);

  const setSortBy = useCallback((sort: SortOption) => {
    dispatch({ type: "SET_FILTER", payload: { sortBy: sort } });
  }, []);

  const setActiveTab = useCallback((tab: RSVPStatus) => {
    dispatch({ type: "SET_FILTER", payload: { activeTab: tab } });
  }, []);

  // Form setters
  const setFormData = useCallback((data: Partial<AddGuestFormData>) => {
    dispatch({ type: "SET_FORM_DATA", payload: data });
  }, []);

  const resetFormData = useCallback(() => {
    dispatch({ type: "RESET_FORM_DATA" });
  }, []);

  // Modal toggles
  const toggleAddModal = useCallback(() => {
    dispatch({ type: "TOGGLE_ADD_MODAL" });
  }, []);

  const toggleFilterSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_FILTER_SIDEBAR" });
  }, []);

  const toggleSortOptions = useCallback(() => {
    dispatch({ type: "TOGGLE_SORT_OPTIONS" });
  }, []);

  // Filter actions
  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  // Guest actions
  const addGuest = useCallback((formData: AddGuestFormData) => {
    const newGuest = createGuestFromForm(formData);
    dispatch({ type: "ADD_GUEST", payload: newGuest });
  }, []);

  const updateGuestStatus = useCallback(
    (id: string, status: Guest["status"]) => {
      dispatch({ type: "UPDATE_GUEST", payload: { id, updates: { status } } });
    },
    [],
  );

  const sendInvite = useCallback((id: string) => {
    dispatch({
      type: "UPDATE_GUEST",
      payload: { id, updates: { status: "Pending" } },
    });
  }, []);

  const refresh = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  return {
    // State
    guests: state.guests,
    isLoading: state.isLoading,
    isImporting: state.isImporting,
    error: state.error,
    showAddModal: state.showAddModal,
    showFilterSidebar: state.showFilterSidebar,
    showSortOptions: state.showSortOptions,
    filters: state.filters,
    formData: state.formData,

    // Computed
    stats,
    filteredGuests,
    categories,

    // Actions
    setSearchQuery,
    setSelectedCategory,
    setSelectedInvitation,
    setSortBy,
    setActiveTab,
    setFormData,
    toggleAddModal,
    toggleFilterSidebar,
    toggleSortOptions,
    resetFilters,
    resetFormData,
    addGuest,
    updateGuestStatus,
    sendInvite,
    refresh,
  };
};

export default useGuests;
