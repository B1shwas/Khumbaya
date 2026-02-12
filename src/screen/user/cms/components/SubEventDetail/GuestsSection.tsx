import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GuestsSectionProps {
  guestsCount: number;
  invitedCount: number;
  pendingCount: number;
  onManageGuests: () => void;
}

export const GuestsSection: React.FC<GuestsSectionProps> = ({
  guestsCount,
  invitedCount,
  pendingCount,
  onManageGuests,
}) => {
  return (
    <View style={localStyles.section}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>Guests</Text>
        <Text style={localStyles.sectionSubtitle}>{invitedCount} invited</Text>
      </View>

      <View style={localStyles.guestActions}>
        <TouchableOpacity
          style={localStyles.guestActionButton}
          onPress={onManageGuests}
        >
          <Ionicons name="people-outline" size={20} color="#ee2b8c" />
          <Text style={localStyles.guestActionText}>Manage Guest List</Text>
        </TouchableOpacity>
      </View>

      <View style={localStyles.guestStats}>
        <View style={localStyles.guestStat}>
          <Text style={localStyles.guestStatNumber}>{guestsCount}</Text>
          <Text style={localStyles.guestStatLabel}>Total</Text>
        </View>
        <View style={localStyles.guestStat}>
          <Text style={localStyles.guestStatNumber}>{invitedCount}</Text>
          <Text style={localStyles.guestStatLabel}>Invited</Text>
        </View>
        <View style={localStyles.guestStat}>
          <Text style={localStyles.guestStatNumber}>{pendingCount}</Text>
          <Text style={localStyles.guestStatLabel}>Pending</Text>
        </View>
      </View>
    </View>
  );
};

import { TouchableOpacity } from "react-native";

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
  guestActions: {
    marginBottom: 16,
  },
  guestActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fceaf4",
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  guestActionText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#ee2b8c",
  },
  guestStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  guestStat: {
    alignItems: "center",
  },
  guestStatNumber: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 24,
    color: "#181114",
  },
  guestStatLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
});
