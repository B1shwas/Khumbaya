import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BudgetCard from "../../screen/budget/BudgetCard";
import BudgetSummary from "../../screen/budget/BudgetSummary";
import { useBudget } from "./hooks/useBudget";
import { BudgetItem } from "./types/budget.types";

export default function BudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  // Check if user is invited guest (not owner) - hide budget for them
  const isInvitedGuest = params.isInvited === "true";

  const {
    budgetItems,
    summary,
    loading,
    refreshing,
    refresh,
    removeItem,
    updateItem,
    togglePaid,
  } = useBudget(eventId);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleEdit = useCallback((item: BudgetItem) => {
    // TODO: Implement edit modal
    Alert.alert("Edit", `Edit ${item.category}`);
  }, []);

  const handleAddNew = useCallback(() => {
    setShowAddModal(true);
  }, []);

  // If user is invited guest, show no access
  if (isInvitedGuest) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
        {/* No Access */}
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
            <Ionicons name="lock-closed" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Budget Not Available
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            The budget details for this event are only visible to the event
            organizer.
          </Text>
          <TouchableOpacity
            className="bg-pink-500 rounded-xl px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="text-base font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderBudgetItem = useCallback(
    ({ item }: { item: BudgetItem }) => (
      <BudgetCard
        item={item}
        onDelete={removeItem}
        onEdit={handleEdit}
        onTogglePaid={togglePaid}
      />
    ),
    [removeItem, handleEdit, togglePaid]
  );

  const ListHeader = useCallback(
    () => (
      <View>
        <BudgetSummary summary={summary} />

        {/* Section Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">Expenses</Text>
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={handleAddNew}
          >
            <Ionicons name="add" size={20} color="#EE2B8C" />
            <Text className="text-sm font-semibold text-pink-500">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [summary, handleAddNew]
  );

  const ListEmpty = useCallback(
    () => (
      <View className="items-center py-10">
        <Ionicons name="wallet-outline" size={64} color="#D1D5DB" />
        <Text className="text-lg font-semibold text-gray-500 mt-4">
          No expenses yet
        </Text>
        <Text className="text-sm text-gray-400 mt-1">
          Add your first budget item to get started
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      {/* Budget List */}
      <FlatList
        data={budgetItems}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        className="px-4 pb-24"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#EE2B8C"]}
            tintColor="#EE2B8C"
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-pink-500 items-center justify-center shadow-lg"
        style={{
          shadowColor: "#EE2B8C",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={handleAddNew}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Modal Placeholder */}
      {/* TODO: Add modal for adding new budget items */}
    </SafeAreaView>
  );
}
