import { Text, View } from "react-native";

interface BudgetHeroCardProps {
  totalBudget: number;
  spent: number;
  spentPercentage: number;
}

const fmt = (n: number) => (n === 0 ? "$0" : `$${n.toLocaleString("en-US")}`);

export function BudgetHeroCard({
  totalBudget,
  spent,
  spentPercentage,
}: BudgetHeroCardProps) {
  return (
    <View className="rounded-[32px] bg-[#181114] p-8 shadow-2xl overflow-hidden mb-4">
      {/* decorative blob */}
      <View className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#ee2b8c]/20 opacity-60" />
      <Text className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">
        Total Budget
      </Text>
      <Text className="text-5xl font-extrabold text-white tracking-tighter mb-6">
        {fmt(totalBudget)}
      </Text>
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm font-semibold text-white/80">
          Spent: {fmt(spent)}
        </Text>
        <Text className="text-sm font-semibold text-white/80">
          {spentPercentage.toFixed(1)}%
        </Text>
      </View>
      {/* progress bar */}
      <View className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
        <View
          className="h-full bg-[#ee2b8c] rounded-full"
          style={{ width: `${spentPercentage}%` }}
        />
      </View>
    </View>
  );
}
