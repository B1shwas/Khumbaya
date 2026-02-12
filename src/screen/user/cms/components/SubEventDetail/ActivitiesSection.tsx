import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { SelectedActivity } from "../../types/subevent";

interface ActivitiesSectionProps {
  activities: SelectedActivity[];
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  activities,
}) => {
  const getIconForCategory = (category: string) => {
    const icons: Record<string, string> = {
      ceremony: "heart",
      entertainment: "musical-notes",
      food: "restaurant",
      preparation: "brush",
      decoration: "flower",
      photo: "camera",
      other: "ellipsis-horizontal",
    };
    return icons[category] || "time";
  };

  return (
    <View style={localStyles.section}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>Timeline Activities</Text>
        <Text style={localStyles.sectionSubtitle}>
          {activities.length} activities scheduled
        </Text>
      </View>

      {activities.map((item) => (
        <View key={item.activity.id} style={localStyles.activityCard}>
          <View style={localStyles.activityIcon}>
            <Ionicons
              name={getIconForCategory(item.activity.category) as any}
              size={20}
              color="#ee2b8c"
            />
          </View>

          <View style={localStyles.activityInfo}>
            <Text style={localStyles.activityName}>{item.activity.title}</Text>
            <View style={localStyles.activityMeta}>
              <View style={localStyles.activityTime}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text style={localStyles.activityTimeText}>{item.time}</Text>
              </View>
              <View style={localStyles.activityBudget}>
                <Ionicons name="wallet-outline" size={12} color="#6B7280" />
                <Text style={localStyles.activityBudgetText}>
                  {item.budget}
                </Text>
              </View>
            </View>
          </View>

          <View style={localStyles.activityStatus}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
        </View>
      ))}
    </View>
  );
};

const localStyles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fceaf4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activityTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activityTimeText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  activityBudget: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activityBudgetText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  activityStatus: {
    marginLeft: 8,
  },
});
