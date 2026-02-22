import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BudgetCard from "./components/BudgetCard";
import BudgetSummary from "./components/BudgetSummary";
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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget</Text>
          <View style={styles.headerButton} />
        </View>

        {/* No Access */}
        <View style={styles.noAccessContainer}>
          <View style={styles.noAccessIcon}>
            <Ionicons name="lock-closed" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.noAccessTitle}>Budget Not Available</Text>
          <Text style={styles.noAccessSubtitle}>
            The budget details for this event are only visible to the event
            organizer.
          </Text>
          <TouchableOpacity
            style={styles.noAccessButton}
            onPress={() => router.back()}
          >
            <Text style={styles.noAccessButtonText}>Go Back</Text>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <TouchableOpacity style={styles.sectionAction} onPress={handleAddNew}>
            <Ionicons name="add" size={20} color="#EE2B8C" />
            <Text style={styles.sectionActionText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [summary, handleAddNew]
  );

  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="wallet-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No expenses yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first budget item to get started
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budget</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="filter" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Budget List */}
      <FlatList
        data={budgetItems}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
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
      <TouchableOpacity style={styles.fab} onPress={handleAddNew}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Modal Placeholder */}
      {/* TODO: Add modal for adding new budget items */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EE2B8C",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EE2B8C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EE2B8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // No Access Styles
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noAccessIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  noAccessTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  noAccessSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  noAccessButton: {
    backgroundColor: "#EE2B8C",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  noAccessButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
