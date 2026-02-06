import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface BudgetItem {
  id: string;
  category: string;
  estimated: number;
  actual: number;
  isPaid: boolean;
}

const budgetData: BudgetItem[] = [
  { id: "1", category: "Venue", estimated: 5000, actual: 5200, isPaid: true },
  { id: "2", category: "Catering", estimated: 3500, actual: 3800, isPaid: true },
  { id: "3", category: "Photography", estimated: 1500, actual: 1500, isPaid: false },
  { id: "4", category: "Decoration", estimated: 2000, actual: 1800, isPaid: false },
  { id: "5", category: "Entertainment", estimated: 1000, actual: 1200, isPaid: false },
  { id: "6", category: "Attire", estimated: 800, actual: 750, isPaid: true },
];

const BudgetItemComponent = ({ item }: { item: BudgetItem }) => {
  const remaining = item.estimated - item.actual;
  const isOverBudget = item.actual > item.estimated;

  return (
    <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <View className={`size-10 rounded-full flex items-center justify-center ${item.isPaid ? "bg-green-100" : "bg-yellow-100"}`}>
            <Ionicons 
              name={item.isPaid ? "checkmark-circle" : "time"} 
              size={22} 
              color={item.isPaid ? "#22c55e" : "#eab308"} 
            />
          </View>
          <Text className="text-gray-900 dark:text-white font-semibold text-lg">{item.category}</Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full active:bg-gray-100">
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-500 dark:text-gray-400 text-sm">Estimated</Text>
        <Text className="text-gray-900 dark:text-white font-medium">${item.estimated.toLocaleString()}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-500 dark:text-gray-400 text-sm">Actual</Text>
        <Text className="text-gray-900 dark:text-white font-medium">${item.actual.toLocaleString()}</Text>
      </View>
      <View className="flex-row justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <Text className={`text-sm font-medium ${isOverBudget ? "text-red-500" : "text-green-500"}`}>
          {isOverBudget ? "Over by" : "Remaining"}
        </Text>
        <Text className={`font-bold ${isOverBudget ? "text-red-500" : "text-green-500"}`}>
          ${Math.abs(remaining).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default function BudgetPage() {
  const totalEstimated = budgetData.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = budgetData.filter(item => item.isPaid).reduce((sum, item) => sum + item.actual, 0);
  const remaining = totalEstimated - totalActual;

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Budget</Text>
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
          <Ionicons name="add" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <ScrollView className="flex-1 px-4 py-4 pb-24" showsVerticalScrollIndicator={false}>
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-primary p-4 rounded-xl">
            <Text className="text-white/80 text-sm mb-1">Total Budget</Text>
            <Text className="text-white text-2xl font-bold">${totalEstimated.toLocaleString()}</Text>
          </View>
          <View className="flex-1 bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Spent</Text>
            <Text className="text-gray-900 dark:text-white text-2xl font-bold">${totalActual.toLocaleString()}</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Paid</Text>
            <Text className="text-green-500 text-2xl font-bold">${totalPaid.toLocaleString()}</Text>
          </View>
          <View className="flex-1 bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Remaining</Text>
            <Text className={`text-2xl font-bold ${remaining >= 0 ? "text-blue-500" : "text-red-500"}`}>
              ${remaining.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Budget Progress */}
        <View className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-900 dark:text-white font-medium">Budget Used</Text>
            <Text className="text-gray-900 dark:text-white font-bold">
              {Math.round((totalActual / totalEstimated) * 100)}%
            </Text>
          </View>
          <View className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <View 
              className={`h-full rounded-full ${totalActual > totalEstimated ? "bg-red-500" : "bg-primary"}`}
              style={{ width: `${Math.min((totalActual / totalEstimated) * 100, 100)}%` }} 
            />
          </View>
        </View>

        {/* Budget Items */}
        <Text className="text-gray-900 dark:text-white font-bold text-lg mb-3">Expenses</Text>
        {budgetData.map((item) => (
          <BudgetItemComponent key={item.id} item={item} />
        ))}

        {/* Bottom spacer */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 z-30 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 active:opacity-90"
        onPress={() => router.push("/add-expense" as any)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
