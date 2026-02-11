import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

interface BudgetItem {
  id: string;
  category: string;
  icon: string;
  estimated: number;
  actual: number;
  isPaid: boolean;
  color: string;
}

const budgetData: BudgetItem[] = [
  { id: "1", category: "Venue", icon: "location", estimated: 5000, actual: 5200, isPaid: true, color: "#8B5CF6" },
  { id: "2", category: "Catering", icon: "restaurant", estimated: 3500, actual: 3800, isPaid: true, color: "#F59E0B" },
  { id: "3", category: "Photography", icon: "camera", estimated: 1500, actual: 1500, isPaid: false, color: "#EC4899" },
  { id: "4", category: "Decoration", icon: "color-palette", estimated: 2000, actual: 1800, isPaid: false, color: "#10B981" },
  { id: "5", category: "Entertainment", icon: "musical-notes", estimated: 1000, actual: 1200, isPaid: false, color: "#6366F1" },
  { id: "6", category: "Attire", icon: "shirt", estimated: 800, actual: 750, isPaid: true, color: "#14B8A6" },
];

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

const BudgetItemComponent = ({ item }: { item: BudgetItem }) => {
  const remaining = item.estimated - item.actual;
  const isOverBudget = item.actual > item.estimated;
  const percentUsed = Math.round((item.actual / item.estimated) * 100);

  return (
    <View style={styles.budgetItemCard}>
      <View style={styles.budgetItemHeader}>
        <View style={[styles.budgetItemIcon, { backgroundColor: item.color + "20" }]}>
          <Text style={styles.budgetItemIconText}>{getCategoryIcon(item.icon)}</Text>
        </View>
        <View style={styles.budgetItemInfo}>
          <Text style={styles.budgetItemCategory}>{item.category}</Text>
          <View style={styles.budgetItemProgress}>
            <View style={styles.budgetProgressBar}>
              <View 
                style={[
                  styles.budgetProgressFill, 
                  { 
                    width: `${Math.min(percentUsed, 100)}%`,
                    backgroundColor: isOverBudget ? "#EF4444" : item.color
                  }
                ]} 
              />
            </View>
            <Text style={[styles.budgetItemPercent, { color: isOverBudget ? "#EF4444" : "#6B7280" }]}>
              {percentUsed}%
            </Text>
          </View>
        </View>
        <View style={styles.budgetItemAmounts}>
          <Text style={styles.budgetItemActual}>${item.actual.toLocaleString()}</Text>
          <Text style={styles.budgetItemEstimated}>
            of ${item.estimated.toLocaleString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.budgetItemFooter}>
        <View style={styles.budgetItemStatus}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.isPaid ? "#10B981" : "#F59E0B" }
          ]} />
          <Text style={styles.statusText}>
            {item.isPaid ? "Paid" : "Pending"}
          </Text>
        </View>
        <Text style={[
          styles.budgetItemRemaining,
          { color: isOverBudget ? "#EF4444" : "#10B981" }
        ]}>
          {isOverBudget ? "+" : "-"}${Math.abs(remaining).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default function BudgetPage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  
  // Check if user is invited guest (not owner) - hide budget for them
  const isInvitedGuest = params.isInvited === "true";
  const isOwner = !isInvitedGuest;

  const totalEstimated = budgetData.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = budgetData.filter(item => item.isPaid).reduce((sum, item) => sum + item.actual, 0);
  const remaining = totalEstimated - totalActual;
  const percentUsed = Math.round((totalActual / totalEstimated) * 100);
  const isOverBudget = totalActual > totalEstimated;

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

        {/* Invited Guest - No Access */}
        <View style={styles.noAccessContainer}>
          <View style={styles.noAccessIcon}>
            <Ionicons name="lock-closed" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.noAccessTitle}>Budget Not Available</Text>
          <Text style={styles.noAccessSubtitle}>
            The budget details for this event are only visible to the event organizer.
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

      {/* Summary Cards */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Main Budget Card */}
        <View style={styles.mainBudgetCard}>
          <View style={styles.mainBudgetHeader}>
            <Text style={styles.mainBudgetLabel}>Total Budget</Text>
            <View style={styles.mainBudgetBadge}>
              <Ionicons name="wallet" size={16} color="white" />
              <Text style={styles.mainBudgetBadgeText}>On Track</Text>
            </View>
          </View>
          <Text style={styles.mainBudgetAmount}>
            ${totalEstimated.toLocaleString()}
          </Text>
          <View style={styles.mainBudgetProgress}>
            <View style={styles.mainProgressBar}>
              <View 
                style={[
                  styles.mainProgressFill,
                  { 
                    width: `${Math.min(percentUsed, 100)}%`,
                    backgroundColor: isOverBudget ? "#EF4444" : "#10B981"
                  }
                ]} 
              />
            </View>
            <Text style={styles.mainProgressText}>
              ${totalActual.toLocaleString()} spent ({percentUsed}%)
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>${totalPaid.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>${(totalActual - totalPaid).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="wallet" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>${(totalEstimated - totalActual).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="pie-chart" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* Budget Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expenses</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Ionicons name="add" size={20} color="#ee2b8c" />
              <Text style={styles.sectionActionText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {budgetData.map((item) => (
            <BudgetItemComponent key={item.id} item={item} />
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/events/budget" as any)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  noAccessTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  noAccessSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  noAccessButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  noAccessButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  // Main Budget Card
  mainBudgetCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mainBudgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mainBudgetLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  mainBudgetBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  mainBudgetBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  mainBudgetAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 16,
  },
  mainBudgetProgress: {
    gap: 8,
  },
  mainProgressBar: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
  },
  mainProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  mainProgressText: {
    fontSize: 12,
    color: "#6b7280",
  },
  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statCardGreen: {
    backgroundColor: "#ecfdf5",
  },
  statCardBlue: {
    backgroundColor: "#eff6ff",
  },
  statCardOrange: {
    backgroundColor: "#fffbeb",
  },
  statCardPurple: {
    backgroundColor: "#f5f3ff",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  // Section
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ee2b8c",
  },
  // Budget Item Card
  budgetItemCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  budgetItemIconText: {
    fontSize: 24,
  },
  budgetItemInfo: {
    flex: 1,
  },
  budgetItemCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
  },
  budgetItemProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  budgetProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    overflow: "hidden",
  },
  budgetProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  budgetItemPercent: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
  },
  budgetItemAmounts: {
    alignItems: "flex-end",
  },
  budgetItemActual: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  budgetItemEstimated: {
    fontSize: 12,
    color: "#9ca3af",
  },
  budgetItemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  budgetItemStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#6b7280",
  },
  budgetItemRemaining: {
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 100,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ee2b8c",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ee2b8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
