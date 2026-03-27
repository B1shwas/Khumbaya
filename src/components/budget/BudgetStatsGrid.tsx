import { View } from "react-native";
import { InfoIcon } from "../ui/InfoIcon";
import { Text } from "../ui/Text";

export interface BudgetStat {
  label: string;
  value: number;
  description?: string;
}

interface BudgetStatsGridProps {
  stats: BudgetStat[];
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  Estimated:
    "Total estimated costs across all expenses in your budget categories. This helps you plan for the overall cost of your event.",
  Spent:
    "Amount that has been paid out so far. This is the actual money spent from your budget.",
  Pending:
    "Total amount that is owed but not yet paid. These are outstanding payments for contracted services.",
  Remaining:
    "Amount left in your budget that hasn't been allocated or spent yet. This is your available budget.",
};

export function BudgetStatsGrid({ stats }: BudgetStatsGridProps) {
  return (
    <View className="gap-3 pt-4">
      <View className="flex-row gap-3">
        {stats.slice(0, 2).map((stat, idx) => (
          <View
            key={stat.label}
            className={`flex-1 bg-white/25  rounded-md p-4`}
          >
            <View className="flex-row items-center gap-2 mb-2">
              <Text
                className="text-white text-xs opacity-80 flex-1"
                variant="h2"
              >
                {stat.label}
              </Text>
              {(stat.description || DEFAULT_DESCRIPTIONS[stat.label]) && (
                <InfoIcon
                  title={stat.label}
                  description={
                    stat.description || DEFAULT_DESCRIPTIONS[stat.label]
                  }
                />
              )}
            </View>
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
            <View className="flex-row items-center gap-2 mb-2">
              <Text
                className="text-white text-xs opacity-80 flex-1"
                variant="h2"
              >
                {stat.label}
              </Text>
              {(stat.description || DEFAULT_DESCRIPTIONS[stat.label]) && (
                <InfoIcon
                  title={stat.label}
                  description={
                    stat.description || DEFAULT_DESCRIPTIONS[stat.label]
                  }
                />
              )}
            </View>
            <Text className="text-white text-base" variant="h2">
              Rs. {stat.value.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
