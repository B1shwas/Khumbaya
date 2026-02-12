import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTimeline } from "./hooks/useTimeline";
import { dayTabs, type TimelineItem } from "./types/timeline";

// Timeline Item Component
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
      <View style={{ flexDirection: "row", gap: 0, paddingBottom: 0 }}>
        {/* Line and Connector */}
        <View style={{ flexDirection: "column", alignItems: "center", paddingTop: 8 }}>
          {item.isActive ? (
            <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
              <View style={{ position: "absolute", width: 16, height: 16, borderRadius: 8, backgroundColor: "#ee2b8c", opacity: 0.3 }} />
              <View style={{ position: "relative", width: 12, height: 12, borderRadius: 6, backgroundColor: "#ee2b8c" }} />
            </View>
          ) : (
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#e5e7eb" }} />
          )}
          {!isLast && (
            <View style={{ width: 2, flex: 1, marginTop: 4, borderRadius: 4, backgroundColor: item.isActive ? "#ee2b8c" : "#e5e7eb", opacity: 0.3 }} />
          )}
        </View>

        {/* Content Card */}
        <View style={{ flex: 1, paddingBottom: 24, paddingLeft: 12 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              borderWidth: 1,
              borderColor: getStatusBorder(),
            }}
          >
            {/* Header with Time and Category */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: item.isActive ? "#ee2b8c" : "#6b7280",
                  }}
                >
                  {item.time}
                  {item.endTime && ` - ${item.endTime}`}
                </Text>
                {item.duration && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 16, backgroundColor: "#f3f4f6" }}>
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.duration}</Text>
                  </View>
                )}
              </View>
              {item.category && (
                <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, backgroundColor: "#f9fafb" }}>
                  <Text style={{ fontSize: 10, color: "#6B7280", fontWeight: "600", textTransform: "uppercase" }}>
                    {item.category}
                  </Text>
                </View>
              )}
            </View>

            {/* Title and Icon Row */}
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
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
                <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>
                  {item.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>{item.location}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text style={{ fontSize: 14, color: "#4b5563", marginTop: 12, marginLeft: 60 }}>
              {item.description}
            </Text>

            {/* Vendor Info */}
            {item.vendor && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f3f4f6", marginLeft: 60 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: "#f9fafb" }}>
                  <Ionicons name="person-outline" size={14} color="#6B7280" />
                  <Text style={{ fontSize: 12, color: "#4b5563" }}>{item.vendor}</Text>
                </View>
              </View>
            )}

            {/* Notes */}
            {item.notes && (
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 8, marginLeft: 60 }}>
                <Ionicons name="information-circle-outline" size={14} color="#3B82F6" />
                <Text style={{ fontSize: 12, color: "#2563eb", flex: 1 }}>{item.notes}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f3f4f6" }}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb" }}
                onPress={() => router.push("/calendar" as any)}
              >
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#6B7280" }}>Calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb" }}
                onPress={() => router.push("/map" as any)}
              >
                <Ionicons name="map-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#6B7280" }}>Map</Text>
              </TouchableOpacity>
              {item.hasAction && !item.isPast && (
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: "#fce7f3", borderWidth: 1, borderColor: "#fbcfe8" }}
                  onPress={() => router.push("/edit-timeline-item" as any)}
                >
                  <Ionicons name="create-outline" size={16} color="#ee2b8c" />
                  <Text style={{ fontSize: 14, fontWeight: "500", color: "#ee2b8c" }}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// Day Tab Component
const DayTabComponent = ({
  day,
  isSelected,
  onPress,
}: {
  day: typeof dayTabs[0];
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ minWidth: 70, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8, backgroundColor: isSelected ? "#ee2b8c" : "white" }}
  >
    <Text style={{ fontSize: 12, color: isSelected ? "rgba(255,255,255,0.7)" : "#6b7280", fontWeight: "500" }}>
      {day.dayName}
    </Text>
    <Text style={{ fontSize: 18, fontWeight: "700", color: isSelected ? "white" : "#1f2937", marginTop: 4 }}>
      {day.dayNumber}
    </Text>
    <View style={{ width: 4, height: 4, borderRadius: 2, marginTop: 4, backgroundColor: isSelected ? "white" : "#ee2b8c", opacity: 0.3 }} />
  </TouchableOpacity>
);

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
  <View style={{ flex: 1, marginHorizontal: 4, backgroundColor: "white", borderRadius: 12, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View>
        <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "500" }}>{title}</Text>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937", marginTop: 4 }}>{value}</Text>
      </View>
      <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: `${color}20` }}>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
    </View>
  </View>
);

export default function TimelinePage() {
  const params = { eventId: "" };
  const { timelineItems, selectedDay, setSelectedDay, showAddModal, setShowAddModal, summary } = useTimeline();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Top App Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#f3f4f6", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>Event Schedule</Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Anita & Rahul's Wedding</Text>
        </View>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="ellipsis-vertical" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Day Tabs */}
      <View style={{ backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#f3f4f6", paddingHorizontal: 16, paddingVertical: 12 }}>
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
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>Friday, Oct 24th</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, backgroundColor: "#fce7f3" }}>
            <Ionicons name="time-outline" size={14} color="#ee2b8c" />
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#ee2b8c" }}>Day 2 of 3</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <DaySummaryCard title="Activities" value={timelineItems.length.toString()} icon="list" color="#3B82F6" />
          <DaySummaryCard title="Completed" value={summary.completedCount.toString()} icon="checkmark-circle" color="#10B981" />
          <DaySummaryCard title="Remaining" value={summary.goingCount.toString()} icon="hourglass" color="#F59E0B" />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Today's Progress</Text>
          <Text style={{ fontSize: 12, fontWeight: "500", color: "#ee2b8c" }}>
            {Math.round((summary.completedCount / timelineItems.length) * 100)}%
          </Text>
        </View>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: "#f3f4f6", overflow: "hidden" }}>
          <View
            style={{
              height: "100%",
              borderRadius: 4,
              backgroundColor: "#ee2b8c",
              width: `${(summary.completedCount / timelineItems.length) * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Timeline Container */}
      <FlatList
        data={timelineItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TimelineItemComponent
            item={item}
            isLast={index === timelineItems.length - 1}
            index={index}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6", marginBottom: 8 }}>
              <Ionicons name="checkmark-done" size={20} color="#10B981" />
            </View>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>All activities completed!</Text>
            <Text style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Day 2 of 3 - The Big Day</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{ position: "absolute", bottom: 24, right: 24, zIndex: 30, width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: "#ee2b8c", shadowColor: "#ee2b8c", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }}
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
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 32 }}>
            <View style={{ width: 64, height: 4, borderRadius: 2, backgroundColor: "#e5e7eb", marginBottom: 24, alignSelf: "center" }} />
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1f2937", marginBottom: 16 }}>
              Add Timeline Event
            </Text>

            {/* Quick Add Options */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              {[
                { icon: "heart", label: "Ceremony", color: "#DC2626" },
                { icon: "restaurant", label: "Dining", color: "#F59E0B" },
                { icon: "camera", label: "Photo", color: "#8B5CF6" },
                { icon: "musical-notes", label: "Entertainment", color: "#EC4899" },
                { icon: "gift", label: "Gifts", color: "#10B981" },
                { icon: "ellipsis-horizontal", label: "Other", color: "#6B7280" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={{ width: 80, alignItems: "center", gap: 8, padding: 12, borderRadius: 12, backgroundColor: "#f9fafb" }}
                  onPress={() => setShowAddModal(false)}
                >
                  <View
                    style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: `${option.color}20` }}
                  >
                    <Ionicons name={option.icon as any} size={20} color={option.color} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: "500", color: "#4b5563" }}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={{ width: "100%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#f3f4f6", alignItems: "center" }}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={{ color: "#4b5563", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
