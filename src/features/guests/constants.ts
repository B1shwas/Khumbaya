// Guest Constants
// ============================================

import type {
    CategoryType,
    GuestSource,
    GuestStatus,
    InvitationStatus,
    RSVPStatus,
    SortOption,
} from "./types";

// Colors
export const GUEST_COLORS = {
  going: {
    bg: "#DCFCE7",
    text: "#16A34A",
    darkBg: "bg-green-100",
    darkText: "dark:text-green-400",
  },
  pending: {
    bg: "#FFEDD5",
    text: "#EA580C",
    darkBg: "bg-orange-100",
    darkText: "dark:text-orange-400",
  },
  notGoing: {
    bg: "#FEE2E2",
    text: "#DC2626",
    darkBg: "bg-red-100",
    darkText: "dark:text-red-400",
  },
  notInvited: {
    bg: "#F3F4F6",
    text: "#9CA3AF",
    darkBg: "bg-gray-100",
    darkText: "dark:text-gray-500",
  },
} as const;

export const SOURCE_COLORS: Record<
  GuestSource,
  { icon: string; color: string; label: string }
> = {
  excel: { icon: "document-text-outline", color: "#10B981", label: "Excel" },
  contact: { icon: "people-outline", color: "#3B82F6", label: "Contacts" },
  manual: { icon: "person-outline", color: "#8B5CF6", label: "Manual" },
} as const;

export const STATUS_ICONS: Record<
  GuestStatus,
  { name: string; color: string }
> = {
  Going: { name: "checkmark", color: "#16A34A" },
  Pending: { name: "time", color: "#EA580C" },
  "Not Going": { name: "close", color: "#DC2626" },
  "Not Invited": { name: "mail-outline", color: "#9CA3AF" },
} as const;

// Relations
export const RELATIONS: CategoryType[] = [
  "Family",
  "Friend",
  "Colleague",
  "Relative",
  "Neighbor",
  "Other",
];

export const ALL_RELATIONS: string[] = [
  "Family",
  "Friend",
  "Colleague",
  "Relative",
  "Neighbor",
  "Other",
];

// Tabs
export const RSVP_TABS: RSVPStatus[] = [
  "All",
  "Confirmed",
  "Pending",
  "Not Invited",
];

// Sort Options
export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "By Name", value: "name" },
  { label: "Recently Added", value: "recent" },
  { label: "By Status", value: "status" },
];

// Filter Options
export const INVITATION_FILTERS: { label: string; value: InvitationStatus }[] =
  [
    { label: "All Guests", value: "All" },
    { label: "Invited", value: "Invited" },
    { label: "Not Invited", value: "Not Invited" },
  ];

// Quick Actions
export const QUICK_ACTIONS = [
  {
    icon: "mail-outline",
    label: "Invite All",
    color: "#ee2b8c",
    key: "inviteAll",
  },
  { icon: "people-outline", label: "Groups", color: "#3B82F6", key: "groups" },
  {
    icon: "document-text-outline",
    label: "Export",
    color: "#10B981",
    key: "export",
  },
] as const;

// Icons
export const GUEST_ICONS = {
  search: "search",
  close: "close",
  funnel: "funnel-outline",
  plus: "add",
  checkmark: "checkmark",
  time: "time",
  closeCircle: "close-circle",
  mail: "mail-outline",
  personAdd: "person-add",
  cloudUpload: "cloud-upload",
  arrowBack: "arrow-back",
  options: "options",
  leaf: "leaf-outline",
  send: "send",
  hourglass: "hourglass",
  people: "people-outline",
} as const;

// Dietary Restrictions
export const COMMON_DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Nut allergy",
  "Dairy-free",
  "Halal",
  "Kosher",
] as const;

// Stats
export const STATS_CONFIG = [
  {
    label: "Going",
    icon: "checkmark-circle",
    color: "#16A34A",
    bgColor: "bg-green-100",
  },
  {
    label: "Pending",
    icon: "time",
    color: "#EA580C",
    bgColor: "bg-orange-100",
  },
  {
    label: "Not Going",
    icon: "close-circle",
    color: "#DC2626",
    bgColor: "bg-red-100",
  },
  {
    label: "Not Invited",
    icon: "mail-outline",
    color: "#6B7280",
    bgColor: "bg-gray-100",
  },
] as const;
