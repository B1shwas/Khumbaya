import { View } from "react-native";
import { Text } from "../ui/Text";

export interface BudgetStat {
  label: string;
  value: number;
}

interface BudgetStatsGridProps {
  stats: BudgetStat[];
}

const STAT_COLORS = [
  "bg-rose-500/30",
  "bg-amber-500/30",
  "bg-cyan-500/30",
  "bg-violet-500/30",
];

export function BudgetStatsGrid({ stats }: BudgetStatsGridProps) {
  return (
    <View className="gap-3 pt-4">
      <View className="flex-row gap-3">
        {stats.slice(0, 2).map((stat, idx) => (
          <View
            key={stat.label}
            className={`flex-1 bg-white/25  rounded-md p-4`}
          >
            <Text className="text-white text-xs opacity-80 mb-2" variant="h2">
              {stat.label}
            </Text>
            <Text className="text-white text-base" variant="h2">
              Rs. {stat.value.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-row gap-3">
        {stats.slice(2, 4).map((stat, idx) => (
          <View
            key={stat.label}
            className={`flex-1 bg-white/25 rounded-md p-4`}
          >
            <Text className="text-white text-xs opacity-80 mb-2" variant="h2">
              {stat.label}
            </Text>
            <Text className="text-white text-base" variant="h2">
              Rs. {stat.value.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
