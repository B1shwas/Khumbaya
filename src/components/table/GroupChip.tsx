import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      className={`flex-row items-center py-2.5 px-3 rounded-xl border ${
        isSelected
          ? "bg-primary border-primary"
          : "bg-gray-100 border-gray-200"
      }`}
      onPress={() => onPress?.(group)}
      disabled={!onPress}
    >
      <View
        className={`w-7 h-7 rounded-full items-center justify-center mr-2.5 ${
          group.assigned ? "bg-emerald-100" : "bg-violet-100"
        }`}
      >
        <Ionicons
          name={group.assigned ? "checkmark-circle" : "people-outline"}
          size={16}
          color={group.assigned ? "#10B981" : "#8B5CF6"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-sm font-semibold ${
            isSelected ? "text-white" : "text-gray-900"
          }`}
        >
          {group.name}
        </Text>
        <Text
          className={`text-xs mt-0.5 ${
            isSelected ? "text-pink-100" : "text-gray-500"
          }`}
        >
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
