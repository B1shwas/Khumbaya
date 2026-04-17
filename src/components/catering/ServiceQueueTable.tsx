import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ServiceQueueRow, { ServiceQueueItem } from "./ServiceQueueRow";

const QUEUE_DATA: ServiceQueueItem[] = [
  {
    id: "1",
    name: "Morning Coffee",
    status: "Served",
    guests: 45,
    time: "08:00 AM",
    location: "Lobby West",
    emoji: "☕",
  },
  {
    id: "2",
    name: "Breakfast Buffet",
    status: "Ready",
    guests: 120,
    time: "08:30 AM",
    location: "Grand Hall",
    emoji: "🍳",
  },
  {
    id: "3",
    name: "VIP Snacks",
    status: "Preparing",
    guests: 12,
    time: "10:15 AM",
    location: "Exec Lounge",
    emoji: "🥐",
  },
  {
    id: "4",
    name: "Mid-Day Fruit",
    status: "Queued",
    guests: 200,
    time: "11:00 AM",
    location: "All Foyers",
    emoji: "🍓",
  },
  {
    id: "5",
    name: "Executive Lunch",
    status: "Preparing",
    guests: 25,
    time: "12:30 PM",
    location: "Boardroom A",
    emoji: "🥗",
  },
  {
    id: "6",
    name: "Smoothie Station",
    status: "Queued",
    guests: 350,
    time: "02:00 PM",
    location: "Courtyard",
    emoji: "🥤",
  },
  {
    id: "7",
    name: "Cocktail Hour",
    status: "Queued",
    guests: 500,
    time: "06:00 PM",
    location: "Rooftop Terrace",
    emoji: "🍹",
  },
  {
    id: "8",
    name: "Pastry Basket Refill",
    status: "Served",
    guests: 80,
    time: "07:30 AM",
    location: "Staff Canteen",
    emoji: "🥨",
  },
  {
    id: "9",
    name: "Gala Dinner Wine",
    status: "Queued",
    guests: 650,
    time: "07:30 PM",
    location: "Main Ballroom",
    emoji: "🍷",
  },
  {
    id: "10",
    name: "Midnight Snack",
    status: "Queued",
    guests: 100,
    time: "11:55 PM",
    location: "Club Floor",
    emoji: "🌙",
  },
];

const PAGE_SIZE = 5;

export default function ServiceQueueTable() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(QUEUE_DATA.length / PAGE_SIZE);

  const pageData = useMemo(
    () => QUEUE_DATA.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page]
  );

  return (
    <View className="bg-white rounded-md border border-zinc-100 overflow-hidden mb-4">
      <View className="px-4 py-3 border-b border-zinc-50 flex-row justify-between items-center">
        <Text className="font-bold text-[15px] text-zinc-900">Service Queue</Text>
        <View className="px-2 py-0.5 rounded-md bg-zinc-100">
          <Text className="text-[10px] font-bold text-zinc-500 uppercase">Live</Text>
        </View>
      </View>

      <View className="flex-row px-4 py-2 border-b border-zinc-50">
        <Text className="flex-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Item</Text>
        <Text className="w-24 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</Text>
        <Text className="w-12 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">👥</Text>
        <Text className="w-20 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time</Text>
      </View>

      {pageData.map((item) => (
        <ServiceQueueRow key={item.id} item={item} />
      ))}

      <View className="flex-row justify-between items-center px-4 py-3 bg-zinc-50">
        <Text className="text-[11px] font-semibold text-zinc-400">
          {page * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE + PAGE_SIZE, QUEUE_DATA.length)} of {QUEUE_DATA.length}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            disabled={page === 0}
            onPress={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded-lg border ${page === 0 ? "border-zinc-100 bg-white" : "border-zinc-200 bg-white"
              }`}
          >
            <Text
              className={`text-[12px] font-semibold ${page === 0 ? "text-zinc-300" : "text-zinc-600"
                }`}
            >
              Prev
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={page >= totalPages - 1}
            onPress={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded-lg border ${page >= totalPages - 1
              ? "border-zinc-100 bg-white"
              : "border-zinc-200 bg-white"
              }`}
          >
            <Text
              className={`text-[12px] font-semibold ${page >= totalPages - 1 ? "text-zinc-300" : "text-zinc-600"
                }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
