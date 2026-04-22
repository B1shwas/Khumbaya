import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "../../utils/cn";
import { shadowStyle } from "../../utils/helper";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DateItem {
  day: string;
  date: number;
  disabled?: boolean;
}

interface Event {
  id: string;
  time: string;
  title: string;
  vendor: string;
  vendorIcon: keyof typeof MaterialIcons.glyphMap;
  pax: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DATES: DateItem[] = [
  { day: "Sat", date: 24 },
  { day: "Sun", date: 25 },
  { day: "Mon", date: 26 },
  { day: "Tue", date: 27 },
  { day: "Wed", date: 28 },
  { day: "Thu", date: 29, disabled: true },
];

const EVENTS: Event[] = [
  {
    id: "1",
    time: "08:30 – 09:30 AM",
    title: "Executive Breakfast Briefing",
    vendor: "Luminary Pastries",
    vendorIcon: "business-center",
    pax: "50 Pax",
  },
  {
    id: "2",
    time: "12:15 – 02:00 PM",
    title: "Board of Directors Luncheon",
    vendor: "Atelier Culinary",
    vendorIcon: "restaurant",
    pax: "15 Pax",
  },
  {
    id: "3",
    time: "07:00 – 10:00 PM",
    title: "Annual Gala Reception",
    vendor: "Velvet Signature",
    vendorIcon: "local-bar",
    pax: "250 Pax",
    isActive: true,
  },
  {
    id: "4",
    time: "10:30 PM – 01:00 AM",
    title: "Post-Gala Breakdown & Clean",
    vendor: "Elite Staffing",
    vendorIcon: "cleaning-services",
    pax: "12 Staff",
    isCompleted: true,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const DateChip = ({
  item,
  isSelected,
  onPress,
}: {
  item: DateItem;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    disabled={item.disabled}
    className={cn(
      "flex flex-col items-center justify-center min-w-[60px] py-3 px-2 rounded-md mr-2.5 mb-2",
      isSelected ? "bg-primary" : "bg-white",
      item.disabled ? "opacity-30" : "opacity-100"
    )}
    style={!isSelected ? shadowStyle : { elevation: 4, shadowColor: "#ee2b8c", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
  >
    <Text
      className={cn(
        "text-[10px] font-bold uppercase tracking-widest mb-0.5",
        isSelected ? "text-white/80" : "text-muted-light"
      )}
    >
      {item.day}
    </Text>
    <Text
      className={cn(
        "text-lg font-black",
        isSelected ? "text-white" : "text-on-surface"
      )}
    >
      {item.date}
    </Text>
  </Pressable>
);

const EventCard = ({ event }: { event: Event }) => {
  if (event.isActive) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        className="mb-4 rounded-xl overflow-hidden"
        style={shadowStyle}
      >
        <LinearGradient
          colors={["#ee2b8c", "#d11d73"]}
          className="p-4"
        >
          <View className="flex-row justify-between items-center mb-3">
            <View className="bg-white/20 px-2.5 py-1 rounded-lg">
              <Text className="text-[11px] font-bold text-white">{event.time}</Text>
            </View>
            <View className="flex-row items-center bg-white/30 px-2 py-0.5 rounded-md">
              <View className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />
              <Text className="text-[10px] font-black text-white uppercase tracking-tighter">Live</Text>
            </View>
          </View>

          <Text className="text-lg font-bold text-white mb-3 leading-6">
            {event.title}
          </Text>

          <View className="flex-row items-center justify-between border-t border-white/10 pt-3">
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name={event.vendorIcon} size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-[12px] font-medium text-white/90">
                  {event.vendor}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="group" size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-[12px] font-bold text-white">
                  {event.pax}
                </Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={14} color="white" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={cn(
        "bg-white rounded-xl p-4 mb-4 border border-outline-variant/30",
        event.isCompleted ? "opacity-60" : "opacity-100"
      )}
      activeOpacity={0.7}
      style={shadowStyle}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="bg-surface-container-high px-2.5 py-1 rounded-lg">
          <Text className="text-[11px] font-bold text-on-surface-variant">
            {event.time}
          </Text>
        </View>
        {event.isCompleted && (
          <View className="flex-row items-center gap-1 px-2 py-0.5 bg-green-50 rounded-md">
            <MaterialIcons name="check" size={12} color="#15803d" />
            <Text className="text-[10px] font-black text-green-700 uppercase">Success</Text>
          </View>
        )}
      </View>

      <Text
        className={cn(
          "text-[16px] font-bold mb-3",
          event.isCompleted ? "text-on-surface-variant line-through opacity-70" : "text-on-surface"
        )}
      >
        {event.title}
      </Text>

      <View className="flex-row items-center justify-between border-t border-outline-variant/30 pt-3">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons
              name={event.vendorIcon}
              size={14}
              color="#896175"
            />
            <Text className="text-[12px] font-medium text-muted-light">
              {event.vendor}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons
              name="group"
              size={14}
              color="#896175"
            />
            <Text className="text-[12px] font-medium text-muted-light">
              {event.pax}
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={18} color="#896175" />
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function MealScheduleScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(2); // Mon 26 (index)
  const addClick = () => {
    router.push(`/(protected)/(client-stack)/events/${eventId}/(organizer)/add-catering`);
  }
  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Sticky Top Navigation Bar ── */}
        <View className="bg-background-light px-4 py-2 border-b border-outline-variant/30 shadow-sm">
          <View className="flex-row items-center justify-between h-14 w-full">
            {/* Left: Back Button */}
            <Pressable
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back-ios" size={18} color="#ee2b8c" style={{ marginLeft: 6 }} />
            </Pressable>

            {/* Center: Title (Absolute) */}
            <View
              className="absolute left-0 right-0 items-center justify-center pointer-events-none -z-10"
              style={{ paddingBottom: 2 }} // Optical adjustment
            >
              <Text className="text-xl text-on-surface tracking-tighter font-black text-center">
                Catering
              </Text>
            </View>

            {/* Right: Add Button */}
            <Pressable
              className="flex-row items-center bg-primary px-4 py-2.5 rounded-md gap-2"
              style={{ ...shadowStyle, shadowColor: "#ee2b8c", shadowOpacity: 0.3 }}
              onPress={addClick}
            >
              <Text className="text-white font-black text-[15px] tracking-tight">Add</Text>
              <MaterialIcons name="add" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* ── Date Selection Strip ── */}
        <View className="px-4 py-4 border-b border-outline-variant/30 gap-4">
          <View className="px-4">
            <Pressable
              className="flex flex-row gap-4 items-center justify-center h-[50px] rounded-md bg-white border border-outline-variant/60"
              style={shadowStyle}
            >
              <MaterialIcons name="calendar-today" size={18} color="#ee2b8c" />
              <Text className="text-on-surface-variant text-md font-bold">Select Date</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, marginLeft: 10 }}
            >
              {DATES.map((item, index) => (
                <DateChip
                  key={item.date}
                  item={item}
                  isSelected={selectedDate === index}
                  onPress={() => !item.disabled && setSelectedDate(index)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ── Event List Content ── */}
        <View className="px-4 pt-6">
          {/* Section Header */}


          {/* Event Cards */}
          {EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}

          {/* Subtle Footer */}
          <View className="items-center py-10">
            <View className="w-12 h-1.5 rounded-full bg-outline-variant/50 mb-4" />
            <Text className="text-[11px] font-black text-muted-light uppercase tracking-[4px] text-center">
              Khumbaya Management
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}