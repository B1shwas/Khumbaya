import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { VehicleSummary } from "../../types/logistics";
import { cn } from "../../utils/cn";
import { shadowStyle } from "../../utils/helper";

interface VehicleSummaryCardProps {
  summary: VehicleSummary;
}

export const VehicleSummaryCard: React.FC<VehicleSummaryCardProps> = ({ summary }) => {
  return (
    <View
      className="bg-white border border-outline-variant p-5 rounded-2xl flex-row items-center justify-between mb-6"
      style={shadowStyle}
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View className="w-14 h-14 rounded-2xl bg-primary-container items-center justify-center border border-primary/10">
          <MaterialIcons name="directions-bus" size={28} color="#ee2b8c" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-jakarta-bold text-on-surface mb-1" numberOfLines={1}>
            {summary.vehicle_name}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className={cn(
              "w-2 h-2 rounded-full",
              summary.status.includes("Active") ? "bg-green-500 animate-pulse" : "bg-on-surface-variant/30"
            )} />
            <Text className={cn(
              "text-xs font-jakarta-semibold",
              summary.status.includes("Active") ? "text-green-600" : "text-on-surface-variant"
            )}>
              {summary.status}
            </Text>
          </View>
        </View>
      </View>


    </View>
  );
};
