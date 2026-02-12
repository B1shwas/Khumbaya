// ============================================
// Types
// ============================================

export interface TimelineItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  location: string;
  description: string;
  icon: string;
  iconColor: string;
  isActive: boolean;
  isPast: boolean;
  hasAction: boolean;
  duration?: string;
  category?: string;
  vendor?: string;
  notes?: string;
}

export interface DayTab {
  id: string;
  date: string;
  dayName: string;
  dayNumber: string;
  isActive: boolean;
}

export const timelineData: TimelineItem[] = [
  {
    id: "1",
    time: "08:00 AM",
    endTime: "10:00 AM",
    title: "Morning Breakfast",
    location: "Garden Pavilion",
    description:
      "Start the day with a healthy breakfast spread. Continental and hot options available.",
    icon: "restaurant",
    iconColor: "#F59E0B",
    isActive: false,
    isPast: true,
    hasAction: false,
    duration: "2 hours",
    category: "Dining",
    vendor: "Elite Catering",
  },
  {
    id: "2",
    time: "10:30 AM",
    endTime: "12:30 PM",
    title: "Mehendi Ceremony",
    location: "The Rose Garden",
    description:
      "Traditional henna application with live music and dance performances. Light refreshments served.",
    icon: "color-palette",
    iconColor: "#EE2B8C",
    isActive: true,
    isPast: false,
    hasAction: true,
    duration: "2 hours",
    category: "Ceremony",
    vendor: "Artistic Henna",
    notes: "Bride's side - Section A",
  },
  {
    id: "3",
    time: "01:00 PM",
    endTime: "02:30 PM",
    title: "Lunch Reception",
    location: "Grand Ballroom",
    description: "Multi-cuisine lunch buffet with live cooking stations.",
    icon: "fast-food",
    iconColor: "#10B981",
    isActive: false,
    isPast: false,
    hasAction: true,
    duration: "1.5 hours",
    category: "Dining",
    vendor: "Royal Feast",
  },
  {
    id: "4",
    time: "03:30 PM",
    endTime: "04:30 PM",
    title: "Photo Session",
    location: "Lavender Fields",
    description:
      "Family and couple photoshoot session. All family members requested to be present.",
    icon: "camera",
    iconColor: "#8B5CF6",
    isActive: false,
    isPast: false,
    hasAction: false,
    duration: "1 hour",
    category: "Photography",
    vendor: "Capture Moments",
  },
  {
    id: "5",
    time: "05:00 PM",
    endTime: "06:30 PM",
    title: "Wedding Vows",
    location: "Grand Ballroom A",
    description:
      "The main ceremony begins. Please be seated by 4:45 PM. Seating arrangements will be provided.",
    icon: "heart",
    iconColor: "#DC2626",
    isActive: false,
    isPast: false,
    hasAction: true,
    duration: "1.5 hours",
    category: "Ceremony",
    vendor: "Sacred Vows",
    notes: "Dress code: Traditional/formal",
  },
  {
    id: "6",
    time: "07:00 PM",
    endTime: "11:00 PM",
    title: "Reception Dinner & Party",
    location: "Sunset Terrace",
    description:
      "Dinner, drinks, and dancing under the stars. Live band performance and DJ night to follow.",
    icon: "musical-notes",
    iconColor: "#EC4899",
    isActive: false,
    isPast: false,
    hasAction: true,
    duration: "4 hours",
    category: "Entertainment",
    vendor: "Eventful Nights",
  },
];

export const dayTabs: DayTab[] = [
  { id: "1", date: "Oct 23", dayName: "Thu", dayNumber: "23", isActive: false },
  { id: "2", date: "Oct 24", dayName: "Fri", dayNumber: "24", isActive: true },
  { id: "3", date: "Oct 25", dayName: "Sat", dayNumber: "25", isActive: false },
];

export interface TimelineSummary {
  goingCount: number;
  activeCount: number;
  completedCount: number;
}
