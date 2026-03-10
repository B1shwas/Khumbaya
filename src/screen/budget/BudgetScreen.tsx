import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BudgetItem,
  BudgetSummary as BudgetSummaryType,
} from "../../features/budget/types/budget.types";
import AddExpenseModal from "./AddExpenseModal";

interface BudgetScreenProps {
  budgetItems?: BudgetItem[];
  summary?: BudgetSummaryType;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (item: BudgetItem) => void;
  onTogglePaid?: (id: string) => void;
}

// Sample data for demo
const sampleSummary: BudgetSummaryType = {
  totalEstimated: 35000,
  totalActual: 22550,
  totalPaid: 15000,
  totalPending: 7550,
  remaining: 12450,
  percentUsed: 64,
  isOverBudget: false,
  categoryCount: 4,
};

const sampleBudgetItems: BudgetItem[] = [
  {
    id: "1",
    category: "Venue",
    icon: "location",
    color: "#ec4899",
    estimated: 10000,
    actual: 8500,
    isPaid: true,
  },
  {
    id: "2",
    category: "Catering",
    icon: "restaurant",
    color: "#475569",
    estimated: 12000,
    actual: 12000,
    isPaid: true,
  },
  {
    id: "3",
    category: "Decor",
    icon: "color-palette",
    color: "#ec4899",
    estimated: 5000,
    actual: 2050,
    isPaid: false,
  },
  {
    id: "4",
    category: "Photography",
    icon: "camera",
    color: "#8b5cf6",
    estimated: 8000,
    actual: 0,
    isPaid: false,
  },
];

export default function BudgetScreen({
  budgetItems: initialItems = sampleBudgetItems,
  summary: initialSummary = sampleSummary,
  onDeleteItem = () => {},
  onEditItem = () => {},
  onTogglePaid = () => {},
}: BudgetScreenProps) {
  const [budgetItems, setBudgetItems] = useState(initialItems);
  const [summary, setSummary] = useState(initialSummary);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddExpense = (newExpense: {
    category: string;
    icon: string;
    color: string;
    estimated: number;
    actual: number;
  }) => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      ...newExpense,
      isPaid: false,
    };

    // Add new item to list
    setBudgetItems([...budgetItems, newItem]);

    // Update summary
    const newTotalEstimated = summary.totalEstimated + newExpense.estimated;
    const newTotalActual = summary.totalActual + newExpense.actual;
    const newRemaining = newTotalEstimated - newTotalActual;
    const newPercentUsed = Math.round(
      (newTotalActual / newTotalEstimated) * 100
    );

    setSummary({
      ...summary,
      totalEstimated: newTotalEstimated,
      totalActual: newTotalActual,
      remaining: newRemaining,
      percentUsed: newPercentUsed,
      isOverBudget: newTotalActual > newTotalEstimated,
      categoryCount: summary.categoryCount + 1,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]">
      <ScrollView className="px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4 border-b border-pink-100">
          <MaterialIcons name="arrow-back" size={24} color="#475569" />
          <Text className="text-lg font-bold text-slate-800">Khumbaya</Text>
          <MaterialIcons name="more-horiz" size={24} color="#475569" />
        </View>

        {/* Budget Overview */}
        <View className="py-10 items-center">
          <Text className="text-sm uppercase tracking-widest text-pink-500 font-bold mb-2">
            Wedding Budget
          </Text>

          <Text className="text-5xl font-bold text-slate-800 mb-2">
            ${summary.totalEstimated.toLocaleString()}
          </Text>

          <View className="flex-row gap-2 mb-8">
            <Text className="text-slate-500">Remaining</Text>
            <Text className="font-bold text-slate-800">
              ${summary.remaining.toLocaleString()}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-pink-500"
              style={{ width: `${summary.percentUsed}%` }}
            />
          </View>

          <View className="flex-row justify-between w-full mt-2">
            <Text className="text-xs text-slate-400">
              {summary.percentUsed}% Spent
            </Text>
            <Text className="text-xs text-slate-400">
              ${summary.totalActual.toLocaleString()} used
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View className="space-y-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold text-slate-800">Categories</Text>

            <Text className="text-pink-500 font-semibold">View Details</Text>
          </View>

          {/* Budget Items */}
          {budgetItems.map((item) => (
            <View
              key={item.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-pink-100"
            >
              <View className="flex-row justify-between mb-4">
                <View className="flex-row gap-3 items-center">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: item.color + "20" }}
                  >
                    <MaterialIcons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>

                  <View>
                    <Text className="font-bold text-slate-800">
                      {item.category}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {item.isPaid ? "Paid" : "Pending"}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text className="font-bold text-slate-800">
                    ${item.actual.toLocaleString()}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    Budget: ${item.estimated.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View className="w-full h-1.5 bg-slate-200 rounded-full">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((item.actual / item.estimated) * 100, 100)}%`,
                    backgroundColor:
                      item.actual > item.estimated ? "#EF4444" : item.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View className="h-32" />
      </ScrollView>

      {/* Floating Button - CTA */}
      <TouchableOpacity
        className="absolute bottom-24 self-center bg-slate-800 px-8 py-4 rounded-full flex-row items-center gap-2"
        onPress={() => setShowAddModal(true)}
      >
        <MaterialIcons name="add" size={20} color="white" />
        <Text className="text-white font-bold">Add Expense</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddExpense}
      />
    </SafeAreaView>
  );
}
