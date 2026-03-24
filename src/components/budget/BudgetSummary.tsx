import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { BudgetSummary as BudgetSummaryType } from "../../features/budget/types/budget.types";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
}

export default function BudgetSummary({ summary }: BudgetSummaryProps) {
  const getStatusBadge = () => {
    if (summary.isOverBudget) {
      return { color: "#EF4444", text: "Over Budget", icon: "alert-circle" };
    }
    if (summary.percentUsed > 80) {
      return { color: "#F59E0B", text: "Near Limit", icon: "warning" };
    }
    return { color: "#10B981", text: "On Track", icon: "checkmark-circle" };
  };

  const status = getStatusBadge();

  return (
    <View className="mb-4">
      {/* Main Budget Card */}
      <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-500">Total Budget</Text>
          <View
            className="flex-row items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: status.color }}
          >
            <Ionicons name={status.icon as any} size={14} color="#fff" />
            <Text className="text-xs font-semibold text-white">
              {status.text}
            </Text>
          </View>
        </View>

        <Text className="text-4xl font-extrabold text-gray-900 mb-4">
          ${summary.totalEstimated.toLocaleString()}
        </Text>

        <View className="gap-2">
          <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(summary.percentUsed, 100)}%`,
                backgroundColor: summary.isOverBudget ? "#EF4444" : "#10B981",
              }}
            />
          </View>
          <Text className="text-xs text-gray-500">
            ${summary.totalActual.toLocaleString()} spent ({summary.percentUsed}
            %)
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap gap-3">
        {/* Paid */}
        <View className="w-[48%] bg-green-50 rounded-xl p-4 shadow-sm">
          <View className="w-10 h-10 rounded-lg items-center justify-center mb-2 bg-green-100">
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
          </View>
          <Text className="text-lg font-bold text-gray-900">
            ${summary.totalPaid.toLocaleString()}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Paid</Text>
        </View>

        {/* Pending */}
        <View className="w-[48%] bg-blue-50 rounded-xl p-4 shadow-sm">
          <View className="w-10 h-10 rounded-lg items-center justify-center mb-2 bg-blue-100">
            <Ionicons name="time" size={22} color="#3B82F6" />
          </View>
          <Text className="text-lg font-bold text-gray-900">
            ${summary.totalPending.toLocaleString()}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Pending</Text>
        </View>

        {/* Remaining */}
        <View className="w-[48%] bg-amber-50 rounded-xl p-4 shadow-sm">
          <View className="w-10 h-10 rounded-lg items-center justify-center mb-2 bg-amber-100">
            <Ionicons name="wallet" size={22} color="#F59E0B" />
          </View>
          <Text className="text-lg font-bold text-gray-900">
            ${Math.abs(summary.remaining).toLocaleString()}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {summary.remaining >= 0 ? "Remaining" : "Over"}
          </Text>
        </View>

        {/* Categories */}
        <View className="w-[48%] bg-purple-50 rounded-xl p-4 shadow-sm">
          <View className="w-10 h-10 rounded-lg items-center justify-center mb-2 bg-purple-100">
            <Ionicons name="pie-chart" size={22} color="#8B5CF6" />
          </View>
          <Text className="text-lg font-bold text-gray-900">
            {summary.categoryCount}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Categories</Text>
        </View>
      </View>
    </View>
  );
}
