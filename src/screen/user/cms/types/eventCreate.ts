// ============================================
// Types
// ============================================

export interface EventFormData {
  name: string;
  eventType: string;
  date: Date | null;
  coverImage: string | null;
}

export type EventType =
  | "Wedding"
  | "Engagement"
  | "Reception"
  | "Nikkah"
  | "Other";

export const EVENT_TYPES: EventType[] = [
  "Wedding",
  "Engagement",
  "Reception",
  "Nikkah",
  "Other",
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Calendar helper functions
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};
