import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { type RelativePathString } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

interface TimelineItem {
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

interface DayTab {
  id: string;
  date: string;
  dayName: string;
  dayNumber: string;
  isActive: boolean;
}

// Enhanced timeline data
const timelineData: TimelineItem[] = [
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

const dayTabs: DayTab[] = [
  { id: "1", date: "Oct 23", dayName: "Thu", dayNumber: "23", isActive: false },
  { id: "2", date: "Oct 24", dayName: "Fri", dayNumber: "24", isActive: true },
  { id: "3", date: "Oct 25", dayName: "Sat", dayNumber: "25", isActive: false },
];

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
    className={`items-center px-4 py-2 rounded-xl mr-2 ${
      isSelected ? "bg-primary" : "bg-white"
    }`}
    onPress={onPress}
    style={{ minWidth: 70 }}
  >
    <Text
      className={`text-xs font-medium ${isSelected ? "text-white/70" : "text-gray-500"}`}
    >
      {day.dayName}
    </Text>
    <Text
      className={`text-lg font-bold ${isSelected ? "text-white" : "text-gray-900"}`}
    >
      {day.dayNumber}
    </Text>
    <View
      className={`w-1 h-1 rounded-full mt-1 ${
        isSelected ? "bg-white" : "bg-primary/30"
      }`}
    />
  </TouchableOpacity>
);

const TimelineItemComponent = ({
  item,
  isLast,
  index,
}: {
  item: TimelineItem;
  isLast: boolean;
  index: number;
}) => {
  const getStatusGradient = () => {
    if (item.isActive) return ["#fceaf4", "#fceaf4"];
    if (item.isPast) return ["#f9fafb", "#f9fafb"];
    return ["white", "white"];
  };

  const getStatusBorder = () => {
    if (item.isActive) return "#ee2b8c";
    if (item.isPast) return "#e5e7eb";
    return "#f3f4f6";
  };

  const getIconBgColor = () => {
    if (item.isActive) return "#fceaf4";
    if (item.isPast) return "#f3f4f6";
    return "#f8fafc";
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <View className="group relative flex gap-0 pb-0">
        {/* Line and Connector */}
        <View className="flex flex-col items-center pt-2">
          {item.isActive ? (
            <View className="relative flex items-center justify-center">
              <View className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
              <View className="relative inline-flex size-4 rounded-full bg-primary" />
            </View>
          ) : (
            <View
              className={`size-3 rounded-full ring-4 ${
                item.isPast ? "bg-gray-200" : "bg-gray-200"
              }`}
            />
          )}
          {!isLast && (
            <View
              className={`w-0.5 h-full mt-1 rounded-full ${
                item.isActive ? "bg-primary/30" : "bg-gray-200"
              }`}
            />
          )}
        </View>

        {/* Content Card */}
        <View className="flex-1 pb-6 pl-3">
          <View
            className="bg-white rounded-2xl p-4 shadow-sm border"
            style={{
              borderColor: getStatusBorder(),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}
          >
            {/* Header with Time and Category */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-sm font-bold ${
                    item.isActive ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {item.time}
                  {item.endTime && ` - ${item.endTime}`}
                </Text>
                {item.duration && (
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100">
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text className="text-xs text-gray-500">
                      {item.duration}
                    </Text>
                  </View>
                )}
              </View>
              {item.category && (
                <View className="px-2 py-1 rounded-full bg-gray-50">
                  <Text className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {item.category}
                  </Text>
                </View>
              )}
            </View>

            {/* Title and Icon Row */}
            <View className="flex-row items-start gap-3">
              <View
                className="shrink-0 size-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: getIconBgColor() }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.iconColor}
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 leading-tight">
                  {item.title}
                </Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-500">{item.location}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text className="text-sm text-gray-600 mt-3 leading-relaxed ml-15">
              {item.description}
            </Text>

            {/* Vendor Info */}
            {item.vendor && (
              <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-gray-100 ml-15">
                <View className="flex-row items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50">
                  <Ionicons name="person-outline" size={14} color="#6B7280" />
                  <Text className="text-xs text-gray-600">{item.vendor}</Text>
                </View>
              </View>
            )}

            {/* Notes */}
            {item.notes && (
              <View className="flex-row items-start gap-2 mt-2 ml-15">
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color="#3B82F6"
                />
                <Text className="text-xs text-blue-600 flex-1">
                  {item.notes}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 active:bg-gray-50"
                onPress={() => router.push("/calendar" as RelativePathString)}
              >
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text className="text-sm font-medium text-gray-600">
                  Calendar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 active:bg-gray-50"
                onPress={() => router.push("/map" as RelativePathString)}
              >
                <Ionicons name="map-outline" size={16} color="#6B7280" />
                <Text className="text-sm font-medium text-gray-600">Map</Text>
              </TouchableOpacity>
              {item.hasAction && !item.isPast && (
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 border border-primary/20 active:bg-primary/20"
                  onPress={() =>
                    router.push("/edit-timeline-item" as RelativePathString)
                  }
                >
                  <Ionicons name="create-outline" size={16} color="#ee2b8c" />
                  <Text className="text-sm font-medium text-primary">Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// Day Summary Card
const DaySummaryCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) => (
  <View className="flex-1 mx-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="text-xs text-gray-500 font-medium">{title}</Text>
        <Text className="text-lg font-bold text-gray-900 mt-1">{value}</Text>
      </View>
      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
    </View>
  </View>
);

export default function TimelinePage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [selectedDay, setSelectedDay] = useState("2");
  const [showAddModal, setShowAddModal] = useState(false);

  const goingCount = timelineData.filter((t) => !t.isPast).length;
  const activeCount = timelineData.filter((t) => t.isActive).length;
  const completedCount = timelineData.filter((t) => t.isPast).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Top App Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <Text className="text-lg font-bold text-gray-900">
            Event Schedule
          </Text>
          <Text className="text-xs text-gray-500">Anita & Rahul's Wedding</Text>
        </View>
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
          <Ionicons name="ellipsis-vertical" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Day Tabs */}
      <View className="bg-white border-b border-gray-100 px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dayTabs.map((day) => (
            <DayTabComponent
              key={day.id}
              day={day}
              isSelected={selectedDay === day.id}
              onPress={() => setSelectedDay(day.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Day Summary */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-bold text-gray-900">
            Friday, Oct 24th
          </Text>
          <View className="flex-row items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
            <Ionicons name="time-outline" size={14} color="#ee2b8c" />
            <Text className="text-xs font-semibold text-primary">
              Day 2 of 3
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <DaySummaryCard
            title="Activities"
            value={timelineData.length.toString()}
            icon="list"
            color="#3B82F6"
          />
          <DaySummaryCard
            title="Completed"
            value={completedCount.toString()}
            icon="checkmark-circle"
            color="#10B981"
          />
          <DaySummaryCard
            title="Remaining"
            value={goingCount.toString()}
            icon="hourglass"
            color="#F59E0B"
          />
        </View>
      </View>

      {/* Progress Bar */}
      <View className="px-4 py-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xs text-gray-500">Today's Progress</Text>
          <Text className="text-xs font-medium text-primary">
            {Math.round((completedCount / timelineData.length) * 100)}%
          </Text>
        </View>
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{
              width: `${(completedCount / timelineData.length) * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Timeline Container */}
      <FlatList
        data={timelineData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TimelineItemComponent
            item={item}
            isLast={index === timelineData.length - 1}
            index={index}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View className="py-8 items-center">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mb-2">
              <Ionicons name="checkmark-done" size={20} color="#10B981" />
            </View>
            <Text className="text-sm text-gray-500">
              All activities completed!
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Day 2 of 3 - The Big Day
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 z-30 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 active:opacity-90"
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Event Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Add Timeline Event
            </Text>

            {/* Quick Add Options */}
            <View className="flex-row flex-wrap gap-3 mb-6">
              {[
                { icon: "heart", label: "Ceremony", color: "#DC2626" },
                { icon: "restaurant", label: "Dining", color: "#F59E0B" },
                { icon: "camera", label: "Photo", color: "#8B5CF6" },
                {
                  icon: "musical-notes",
                  label: "Entertainment",
                  color: "#EC4899",
                },
                { icon: "gift", label: "Gifts", color: "#10B981" },
                {
                  icon: "ellipsis-horizontal",
                  label: "Other",
                  color: "#6B7280",
                },
              ].map((option) => (
                <TouchableOpacity
                  key={option.label}
                  className="flex-col items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 w-24"
                  onPress={() => setShowAddModal(false)}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={option.color}
                    />
                  </View>
                  <Text className="text-xs font-medium text-gray-600">
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="w-full py-3 rounded-xl bg-gray-100 items-center"
              onPress={() => setShowAddModal(false)}
            >
              <Text className="text-gray-600 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
