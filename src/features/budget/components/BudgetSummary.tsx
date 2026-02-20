import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BudgetSummary as BudgetSummaryType } from "../types/budget.types";

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
    <View style={styles.container}>
      {/* Main Budget Card */}
      <View style={styles.mainCard}>
        <View style={styles.mainCardHeader}>
          <Text style={styles.mainCardLabel}>Total Budget</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Ionicons name={status.icon as any} size={14} color="#fff" />
            <Text style={styles.statusBadgeText}>{status.text}</Text>
          </View>
        </View>

        <Text style={styles.mainCardAmount}>
          ${summary.totalEstimated.toLocaleString()}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(summary.percentUsed, 100)}%`,
                  backgroundColor: summary.isOverBudget ? "#EF4444" : "#10B981",
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            ${summary.totalActual.toLocaleString()} spent ({summary.percentUsed}
            %)
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Paid */}
        <View style={[styles.statCard, styles.statCardGreen]}>
          <View style={styles.statIconContainer}>
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
          </View>
          <Text style={styles.statValue}>
            ${summary.totalPaid.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Paid</Text>
        </View>

        {/* Pending */}
        <View style={[styles.statCard, styles.statCardBlue]}>
          <View style={styles.statIconContainer}>
            <Ionicons name="time" size={22} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>
            ${summary.totalPending.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        {/* Remaining */}
        <View style={[styles.statCard, styles.statCardOrange]}>
          <View style={styles.statIconContainer}>
            <Ionicons name="wallet" size={22} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>
            ${Math.abs(summary.remaining).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>
            {summary.remaining >= 0 ? "Remaining" : "Over"}
          </Text>
        </View>

        {/* Categories */}
        <View style={[styles.statCard, styles.statCardPurple]}>
          <View style={styles.statIconContainer}>
            <Ionicons name="pie-chart" size={22} color="#8B5CF6" />
          </View>
          <Text style={styles.statValue}>{summary.categoryCount}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mainCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mainCardLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  mainCardAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
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
    backgroundColor: "#ECFDF5",
  },
  statCardBlue: {
    backgroundColor: "#EFF6FF",
  },
  statCardOrange: {
    backgroundColor: "#FFFBEB",
  },
  statCardPurple: {
    backgroundColor: "#F5F3FF",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
