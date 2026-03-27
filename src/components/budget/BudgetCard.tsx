import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { BudgetItem } from "../../features/budget/types/budget.types";

interface BudgetCardProps {
  item: BudgetItem;
  onDelete: (id: string) => void;
  onEdit: (item: BudgetItem) => void;
  onTogglePaid: (id: string) => void;
}

export default function BudgetCard({
  item,
  onDelete,
  onEdit,
  onTogglePaid,
}: BudgetCardProps) {
  const remaining = item.estimated - item.actual;
  const isOverBudget = item.actual > item.estimated;
  const percentUsed = Math.round((item.actual / item.estimated) * 100);

  const getCategoryIcon = (icon: string) => {
    const icons: Record<string, string> = {
      location: "🏛️",
      restaurant: "🍽️",
      camera: "📸",
      "color-palette": "🎨",
      "musical-notes": "🎵",
      shirt: "👔",
    };
    return icons[icon] || "📦";
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.category}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  const rightActions = () => (
    <View className="flex-row items-center rounded-md">
      {/* Edit Action */}
      <Text>Gaysdasdhjk</Text>
    </View>
  );

  return (
    <Swipeable renderRightActions={rightActions} overshootRight={true}>
      <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
        <View className="flex-row items-center">
          {/* Icon */}
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: item.color + "20" }}
          >
            <Text className="text-2xl">{getCategoryIcon(item.icon)}</Text>
          </View>

          {/* Info */}
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              {item.category}
            </Text>

            {/* Progress Bar */}
            <View className="flex-row items-center gap-2">
              <View className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(percentUsed, 100)}%`,
                    backgroundColor: isOverBudget ? "#EF4444" : item.color,
                  }}
                />
              </View>
              <Text
                className="text-xs font-medium min-w-[36px]"
                style={{ color: isOverBudget ? "#EF4444" : "#6B7280" }}
              >
                {percentUsed}%
              </Text>
            </View>
          </View>

          {/* Amounts */}
          <View className="items-end ml-3">
            <Text className="text-base font-bold text-gray-900">
              ${item.actual.toLocaleString()}
            </Text>
            <Text className="text-xs text-gray-500">
              of ${item.estimated.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {/* Status */}
          <TouchableOpacity
            className="flex-row items-center gap-1.5"
            onPress={() => onTogglePaid(item.id)}
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.isPaid ? "#10B981" : "#F59E0B" }}
            />
            <Text className="text-xs text-gray-500">
              {item.isPaid ? "Paid" : "Pending"}
            </Text>
            <Ionicons
              name={item.isPaid ? "checkmark-circle" : "time-outline"}
              size={14}
              color={item.isPaid ? "#10B981" : "#F59E0B"}
            />
          </TouchableOpacity>

          {/* Remaining */}
          <Text
            className="text-sm font-semibold"
            style={{ color: isOverBudget ? "#EF4444" : "#10B981" }}
          >
            {isOverBudget ? "+" : "-"}${Math.abs(remaining).toLocaleString()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}
