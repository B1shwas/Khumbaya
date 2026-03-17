import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import EventFormModal from "@/src/components/event/EventFormModal";

interface TimelineItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  location: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  isActive: boolean;
  isPast: boolean;
  hasAction: boolean;
  duration?: string;
  category?: string;
  vendor?: string;
  notes?: string;
}

interface DayTab {
  id: string;
  date: string;
  dayName: string;
  dayNumber: string;
  isActive: boolean;
}

// Sample data
const sampleDayTabs: DayTab[] = [
  {
    id: "1",
    date: "2024-03-15",
    dayName: "Fri",
    dayNumber: "15",
    isActive: false,
  },
  {
    id: "2",
    date: "2024-03-16",
    dayName: "Sat",
    dayNumber: "16",
    isActive: true,
  },
  {
    id: "3",
    date: "2024-03-17",
    dayName: "Sun",
    dayNumber: "17",
    isActive: false,
  },
  {
    id: "4",
    date: "2024-03-18",
    dayName: "Mon",
    dayNumber: "18",
    isActive: false,
  },
];

const sampleTimelineData: TimelineItem[] = [
  {
    id: "1",
    time: "9:00 AM",
    endTime: "10:00 AM",
    title: "Wedding Setup",
    location: "Grand Ballroom",
    description: "Final preparations and setup for the wedding ceremony",
    icon: "construct-outline",
    iconColor: "#F59E0B",
    isActive: false,
    isPast: true,
    hasAction: false,
    duration: "1h",
    category: "Setup",
    vendor: "Event Team",
  },
];

// Day Tab Component
const DayTabComponent = ({
  day,
  isSelected,
  onPress,
}: {
  day: DayTab;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className={`items-center px-3 py-2 mr-2 rounded-xl min-w-[70px] ${isSelected ? "bg-pink-600" : "bg-white"}`}
    onPress={onPress}
  >
    <Text
      className={`text-xs font-medium ${isSelected ? "text-white/70" : "text-gray-400"}`}
    >
      {day.dayName}
    </Text>
    <Text
      className={`text-lg font-bold ${isSelected ? "text-white" : "text-gray-900"}`}
    >
      {day.dayNumber}
    </Text>
    <View
      className={`w-1 h-1 rounded-full mt-1 ${isSelected ? "bg-white" : "bg-pink-200"}`}
    />
  </TouchableOpacity>
);

// Timeline Item Component
const TimelineItemComponent = ({
  item,
  isLast,
  index,
  onEdit,
}: {
  item: TimelineItem;
  isLast: boolean;
  index: number;
  onEdit: () => void;
}) => {
  const router = useRouter();
  const statusBorder = item.isActive
    ? "border-pink-600"
    : item.isPast
      ? "border-gray-200"
      : "border-gray-100";
  const iconBg = item.isActive
    ? "bg-pink-50"
    : item.isPast
      ? "bg-gray-100"
      : "bg-gray-50";

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      className="pb-6 flex-row"
    >
      {/* Line & Connector */}
      <View className="items-center pt-2">
        {item.isActive ? (
          <View className="relative items-center justify-center">
            <View className="absolute w-6 h-6 rounded-full bg-pink-200/30" />
            <View className="w-4 h-4 rounded-full bg-pink-600" />
          </View>
        ) : (
          <View className="w-3 h-3 rounded-full bg-gray-300" />
        )}
        {!isLast && (
          <View
            className={`w-0.5 flex-1 mt-1 ${item.isActive ? "bg-pink-200/30" : "bg-gray-300"}`}
          />
        )}
      </View>

      {/* Content Card */}
      <View className="flex-1 pl-3">
        <View
          className={`bg-white rounded-2xl p-4 border ${statusBorder} shadow-sm`}
        >
          {/* Time & Category */}
          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center space-x-2">
              <Text
                className={`text-sm font-bold ${item.isActive ? "text-pink-600" : "text-gray-500"}`}
              >
                {item.time}
                {item.endTime ? ` - ${item.endTime}` : ""}
              </Text>
              {item.duration && (
                <View className="flex-row items-center space-x-1 px-1 py-0.5 rounded-xl bg-gray-100">
                  <Ionicons name="time-outline" size={12} color="#6B7280" />
                  <Text className="text-[10px] text-gray-500">
                    {item.duration}
                  </Text>
                </View>
              )}
            </View>
            {item.category && (
              <View className="px-1 py-0.5 rounded-lg bg-gray-50">
                <Text className="text-[10px] font-medium text-gray-500 uppercase">
                  {item.category}
                </Text>
              </View>
            )}
          </View>

          {/* Title & Icon */}
          <View className="flex-row items-start space-x-3">
            <View
              className={`w-12 h-12 rounded-xl items-center justify-center ${iconBg}`}
            >
              <Ionicons name={item.icon} size={24} color={item.iconColor} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                {item.title}
              </Text>
              <View className="flex-row items-center mt-1 space-x-1">
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500">{item.location}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text className="text-xs text-gray-600 mt-2 ml-14">
            {item.description}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row space-x-2 mt-2 pt-2 border-t border-gray-100">
            {item.hasAction && !item.isPast && (
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center space-x-1 py-2 rounded-lg bg-pink-50 border border-pink-200"
                onPress={onEdit}
              >
                <Ionicons name="create-outline" size={16} color="#EE2B8C" />
                <Text className="text-xs text-pink-600">Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default function TimelinePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [selectedDay, setSelectedDay] = useState("2");
  const [showAddModal, setShowAddModal] = useState(false);
  const [timelineData] = useState<TimelineItem[]>(sampleTimelineData);
  const [dayTabs] = useState<DayTab[]>(sampleDayTabs);

  // Calculate summary stats
  const totalEvents = timelineData.length;
  const completedEvents = timelineData.filter((item) => item.isPast).length;
  const upcomingEvents = timelineData.filter(
    (item) => !item.isPast && !item.isActive
  ).length;

  const renderTimelineItem = ({
    item,
    index,
  }: {
    item: TimelineItem;
    index: number;
  }) => (
    <TimelineItemComponent
      item={item}
      isLast={index === timelineData.length - 1}
      index={index}
      onEdit={() => console.log("Edit item:", item.id)}
    />
  );

  const handleSaveEvent = (data: any) => {
 
    // Handle save logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Day Tabs */}
        <View className="px-4 pb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {dayTabs.map((day) => (
              <DayTabComponent
                key={day.id}
                day={day}
                isSelected={day.id === selectedDay}
                onPress={() => setSelectedDay(day.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Summary Cards */}
        <View className="px-4 pb-4">
          <View className="flex-row space-x-3">
            {/* Completed */}
            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
              <View className="flex-row items-center space-x-2">
                <View className="w-8 h-8 rounded-lg bg-pink-600 items-center justify-center">
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {completedEvents}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-1">Completed</Text>
            </View>

            {/* Upcoming */}
            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
              <View className="flex-row items-center space-x-2">
                <View className="w-8 h-8 rounded-lg bg-blue-500 items-center justify-center">
                  <Ionicons name="time" size={18} color="#fff" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {upcomingEvents}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-1">Upcoming</Text>
            </View>

            {/* Total */}
            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
              <View className="flex-row items-center space-x-2">
                <View className="w-8 h-8 rounded-lg bg-green-500 items-center justify-center">
                  <Ionicons name="list" size={18} color="#fff" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {totalEvents}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-1">Total</Text>
            </View>
          </View>
        </View>

        {/* Timeline List */}
        <View className="px-4 pb-24">
          <FlatList
            data={timelineData}
            renderItem={renderTimelineItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-pink-600 items-center justify-center"
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Event Form Modal */}
      <EventFormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveEvent}
        title="Add Timeline Event"
        mode="timeline"
      />
    </SafeAreaView>
  );
}
