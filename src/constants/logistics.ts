import { TimelineEvent, VehicleSummary } from "../types/logistics";

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    time: "07:00 AM - 08:15 AM",
    status: "Completed",
    pickup: "Terminal 2 Arrivals",
    dropoff: "Grand Plaza Hotel",
    groupName: "Chen Delegation",
    guestCount: 12,
    pickupIcon: "flight-land",
    dropoffIcon: "hotel",
    guests: [
      { initials: "MC", name: "Ming C.", color: "bg-blue-100", txColor: "text-blue-700" },
      { initials: "LW", name: "Lin W.", color: "bg-purple-100", txColor: "text-purple-700" },
      { initials: "JL", name: "Jian L.", color: "bg-orange-100", txColor: "text-orange-700" },
    ],
  },
  {
    id: "2",
    time: "09:30 AM - 10:45 AM",
    status: "On Route",
    pickup: "Grand Plaza Hotel",
    dropoff: "Convention Center",
    groupName: "Sharma Family",
    guestCount: 5,
    pickupIcon: "my-location",
    dropoffIcon: "location-on",
    guests: [
      { initials: "SF", name: "Sharma F.", color: "bg-pink-100", txColor: "text-pink-700" },
    ],
  },
  {
    id: "3",
    time: "12:00 PM - 01:30 PM",
    status: "Upcoming",
    pickup: "Marina Bay Dining",
    dropoff: "Grand Plaza Hotel",
    groupName: "VIP Corporate Group",
    guestCount: 18,
    pickupIcon: "restaurant",
    dropoffIcon: "hotel",
    guests: [
      { initials: "AS", name: "Alice S.", color: "bg-blue-100", txColor: "text-blue-700" },
      { initials: "BJ", name: "Bob J.", color: "bg-green-100", txColor: "text-green-700" },
      { initials: "CD", name: "Carol D.", color: "bg-yellow-100", txColor: "text-yellow-700" },
    ],
  },
];

export const MOCK_VEHICLE_SUMMARY: VehicleSummary = {
  id: "shuttle-1",
  name: "Shuttle 1",
  type: "20-Seater Executive Coach",
  status: "Active - On Route",
  loadFactor: 85,
  tripsCompleted: 4,
  totalTrips: 7,
  date: "Oct 24, 2023",
};
