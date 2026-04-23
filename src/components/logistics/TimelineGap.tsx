import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface TimelineGapProps {
  duration: string;
  timeRange: string;
}

export const TimelineGap: React.FC<TimelineGapProps> = ({ duration, timeRange }) => {
  return (
    <View className="flex-row items-center justify-center py-5 mb-4 bg-surface-container/30 border border-dashed border-outline-variant rounded-2xl">
      <View className="bg-white p-1 rounded-full mr-2 shadow-sm">
        <MaterialIcons name="schedule" size={14} color="#594048" />
      </View>
      <Text className="text-[11px] font-jakarta-semibold text-on-surface-variant">
        {timeRange} • Available Gap ({duration})
      </Text>
    </View>
  );
};
