import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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

// Replace your data arrays (timelineData, dayTabs) here
// ... (use your existing timelineData & dayTabs)

// Sample data - Replace with your actual timelineData & dayTabs
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
  {
    id: "2",
    time: "10:00 AM",
    endTime: "11:00 AM",
    title: "Floral Arrangements",
    location: "Main Hall",
    description: "Flower decoration and centerpiece placement",
    icon: "flower-outline",
    iconColor: "#10B981",
    isActive: false,
    isPast: true,
    hasAction: true,
    duration: "1h",
    category: "Decoration",
    vendor: "Bloom Flowers",
    notes: "Contact: +1 234-567-8900",
  },
  {
    id: "3",
    time: "11:30 AM",
    endTime: "12:00 PM",
    title: "Guest Arrival & Registration",
    location: "Main Entrance",
    description: "Guest check-in and welcome drinks",
    icon: "people-outline",
    iconColor: "#3B82F6",
    isActive: true,
    isPast: false,
    hasAction: true,
    duration: "30m",
    category: "Welcome",
  },
  {
    id: "4",
    time: "12:00 PM",
    endTime: "1:00 PM",
    title: "Wedding Ceremony",
    location: "Garden Venue",
    description: "The main wedding ceremony",
    icon: "heart-outline",
    iconColor: "#EE2B8C",
    isActive: false,
    isPast: false,
    hasAction: true,
    duration: "1h",
    category: "Ceremony",
  },
  {
    id: "5",
    time: "1:00 PM",
    endTime: "2:30 PM",
    title: "Photography Session",
    location: "Photo Studio",
    description: "Couple and family photos",
    icon: "camera-outline",
    iconColor: "#8B5CF6",
    isActive: false,
    isPast: false,
    hasAction: false,
    duration: "1.5h",
    category: "Photos",
    vendor: "Capture Moments",
  },
  {
    id: "6",
    time: "2:30 PM",
    endTime: "4:00 PM",
    title: "Cocktail Hour",
    location: "Terrace Lounge",
    description: "Guests enjoy drinks and appetizers",
    icon: "wine-outline",
    iconColor: "#F97316",
    isActive: false,
    isPast: false,
    hasAction: false,
    duration: "1.5h",
    category: "Reception",
  },
  {
    id: "7",
    time: "4:00 PM",
    endTime: "6:00 PM",
    title: "Reception Dinner",
    location: "Grand Ballroom",
    description: "Wedding dinner and toasts",
    icon: "restaurant-outline",
    iconColor: "#EF4444",
    isActive: false,
    isPast: false,
    hasAction: true,
    duration: "2h",
    category: "Dinner",
    vendor: "Gourmet Catering",
  },
  {
    id: "8",
    time: "6:00 PM",
    endTime: "7:00 PM",
    title: "First Dance & Cake Cutting",
    location: "Dance Floor",
    description: "Couple's first dance and wedding cake cutting",
    icon: "musical-notes-outline",
    iconColor: "#EC4899",
    isActive: false,
    isPast: false,
    hasAction: false,
    duration: "1h",
    category: "Entertainment",
  },
  {
    id: "9",
    time: "7:00 PM",
    endTime: "8:00 PM",
    title: "Bouquet Toss",
    location: "Dance Floor",
    description: "Traditional bouquet toss ceremony",
    icon: "leaf-outline",
    iconColor: "#14B8A6",
    isActive: false,
    isPast: false,
    hasAction: false,
    duration: "1h",
    category: "Tradition",
  },
  {
    id: "10",
    time: "8:00 PM",
    endTime: "11:00 PM",
    title: "Party & Dancing",
    location: "Dance Floor",
    description: "Evening celebration with DJ and dancing",
    icon: "disc-outline",
    iconColor: "#6366F1",
    isActive: false,
    isPast: false,
    hasAction: false,
    duration: "3h",
    category: "Party",
    vendor: "DJ Beat Master",
  },
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
    style={{
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      marginRight: 8,
      backgroundColor: isSelected ? "#EE2B8C" : "#fff",
      minWidth: 70,
    }}
    onPress={onPress}
  >
    <Text
      style={{
        fontSize: 12,
        fontWeight: "500",
        color: isSelected ? "rgba(255,255,255,0.7)" : "#6B7280",
      }}
    >
      {day.dayName}
    </Text>
    <Text
      style={{
        fontSize: 18,
        fontWeight: "700",
        color: isSelected ? "#fff" : "#111827",
      }}
    >
      {day.dayNumber}
    </Text>
    <View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
        backgroundColor: isSelected ? "#fff" : "rgba(238,43,140,0.3)",
      }}
    />
  </TouchableOpacity>
);

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
  const getStatusBorder = () =>
    item.isActive ? "#EE2B8C" : item.isPast ? "#E5E7EB" : "#F3F4F6";
  const getIconBgColor = () =>
    item.isActive ? "#FCEAF4" : item.isPast ? "#F3F4F6" : "#F8FAFC";

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <View style={{ flexDirection: "row", paddingBottom: 24 }}>
        {/* Line & Connector */}
        <View style={{ alignItems: "center", paddingTop: 8 }}>
          {item.isActive ? (
            <View
              style={{
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "rgba(238,43,140,0.3)",
                }}
              />
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#EE2B8C",
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: "#D1D5DB",
              }}
            />
          )}
          {!isLast && (
            <View
              style={{
                width: 2,
                flex: 1,
                marginTop: 4,
                backgroundColor: item.isActive
                  ? "rgba(238,43,140,0.3)"
                  : "#D1D5DB",
              }}
            />
          )}
        </View>

        {/* Content Card */}
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: getStatusBorder(),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}
          >
            {/* Time & Category */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: item.isActive ? "#EE2B8C" : "#6B7280",
                  }}
                >
                  {item.time}
                  {item.endTime ? ` - ${item.endTime}` : ""}
                </Text>
                {item.duration && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 12,
                      backgroundColor: "#F3F4F6",
                    }}
                  >
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text style={{ fontSize: 10, color: "#6B7280" }}>
                      {item.duration}
                    </Text>
                  </View>
                )}
              </View>
              {item.category && (
                <View
                  style={{
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 8,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "500",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.category}
                  </Text>
                </View>
              )}
            </View>

            {/* Title & Icon */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: getIconBgColor(),
                }}
              >
                <Ionicons name={item.icon} size={24} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                    gap: 4,
                  }}
                >
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>
                    {item.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text
              style={{
                fontSize: 12,
                color: "#4B5563",
                marginTop: 8,
                marginLeft: 60,
              }}
            >
              {item.description}
            </Text>

            {/* Vendor */}
            {item.vendor && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 8,
                  paddingTop: 8,
                  borderTopWidth: 1,
                  borderColor: "#F3F4F6",
                  marginLeft: 60,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 8,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Ionicons name="person-outline" size={14} color="#6B7280" />
                  <Text style={{ fontSize: 10, color: "#4B5563" }}>
                    {item.vendor}
                  </Text>
                </View>
              </View>
            )}

            {/* Notes */}
            {item.notes && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 4,
                  marginTop: 4,
                  marginLeft: 60,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color="#3B82F6"
                />
                <Text style={{ fontSize: 10, color: "#2563EB", flex: 1 }}>
                  {item.notes}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginTop: 8,
                paddingTop: 8,
                borderTopWidth: 1,
                borderColor: "#F3F4F6",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                }}
                onPress={() => router.push("/calendar")}
              >
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                }}
                onPress={() => router.push("/map")}
              >
                <Ionicons name="map-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Map</Text>
              </TouchableOpacity>

              {item.hasAction && !item.isPast && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: "rgba(238,43,140,0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(238,43,140,0.2)",
                  }}
                  onPress={onEdit}
                >
                  <Ionicons name="create-outline" size={16} color="#EE2B8C" />
                  <Text style={{ fontSize: 12, color: "#EE2B8C" }}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
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

  const activeDay = dayTabs.find((day) => day.id === selectedDay);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <TouchableOpacity
                style={{
                  padding: 8,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#6B7280" />
              </TouchableOpacity>
              <View>
                <Text
                  style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}
                >
                  Timeline
                </Text>
                <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
                  {activeDay?.dayName}, {activeDay?.date}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day Tabs */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
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
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: "#EE2B8C",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                </View>
                <Text
                  style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}
                >
                  {completedEvents}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                Completed
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: "#3B82F6",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="time" size={18} color="#fff" />
                </View>
                <Text
                  style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}
                >
                  {upcomingEvents}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                Upcoming
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: "#10B981",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="list" size={18} color="#fff" />
                </View>
                <Text
                  style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}
                >
                  {totalEvents}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                Total
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline List */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
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
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#EE2B8C",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
            }}
          >
            <View
              style={{
                width: 64,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#E5E7EB",
                alignSelf: "center",
                marginBottom: 24,
              }}
            />
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>
              Add Timeline Event
            </Text>
            {/* Add options/buttons here */}
            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "#F3F4F6",
                alignItems: "center",
              }}
              onPress={() => setShowAddModal(false)}
            >
              <Text
                style={{ fontSize: 14, color: "#4B5563", fontWeight: "600" }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
