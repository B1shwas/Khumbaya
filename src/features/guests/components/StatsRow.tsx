// StatsRow Component
// ============================================

import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { STATS_CONFIG } from "../constants";
import type { GuestStats } from "../types";

interface StatsRowProps {
  stats: GuestStats;
}

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
}

const StatsCard = ({ label, value, icon, color, bgColor }: StatsCardProps) => (
  <View className="flex-1 mx-1">
    <View className={`${bgColor} rounded-2xl p-3`}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text
            className="text-xs text-gray-500 font-medium"
            accessibilityLabel={`${label} count`}
          >
            {label}
          </Text>
          <Text className={`text-xl font-bold ${color} mt-1`}>{value}</Text>
        </View>
        <View
          className={`${bgColor.replace("bg-", "bg-opacity-20 ")} p-2 rounded-full`}
        >
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
      </View>
    </View>
  </View>
);

const StatsRow = ({ stats }: StatsRowProps) => {
  const statValues = [
    { key: "going", value: stats.going },
    { key: "pending", value: stats.pending },
    { key: "notGoing", value: stats.notGoing },
    { key: "notInvited", value: stats.notInvited },
  ];

  return (
    <View className="px-4 py-2" accessibilityLabel="Guest statistics">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {STATS_CONFIG.map((config, index) => (
          <StatsCard
            key={config.label}
            label={config.label}
            value={statValues[index].value}
            icon={config.icon}
            color={config.color}
            bgColor={config.bgColor}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default StatsRow;
