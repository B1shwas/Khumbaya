import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GuestGroup } from "../../utils/tableHelpers";

interface GroupChipProps {
  group: GuestGroup;
  isSelected?: boolean;
  onPress?: (group: GuestGroup) => void;
}

export const GroupChip: React.FC<GroupChipProps> = ({
  group,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={() => onPress?.(group)}
      disabled={!onPress}
    >
      <View
        style={[
          styles.iconContainer,
          group.assigned && styles.iconContainerAssigned,
        ]}
      >
        <Ionicons
          name={group.assigned ? "checkmark-circle" : "people-outline"}
          size={16}
          color={group.assigned ? "#10B981" : "#8B5CF6"}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, isSelected && styles.nameSelected]}>
          {group.name}
        </Text>
        <Text style={[styles.size, isSelected && styles.sizeSelected]}>
          {group.totalSize} {group.totalSize === 1 ? "person" : "people"}
          {group.assigned && " • Seated"}
        </Text>
      </View>
      {isSelected && (
        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipSelected: {
    backgroundColor: "#EE2B8C",
    borderColor: "#EE2B8C",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconContainerAssigned: {
    backgroundColor: "#D1FAE5",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  nameSelected: {
    color: "#FFFFFF",
  },
  size: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  sizeSelected: {
    color: "#FCE7F3",
  },
});
