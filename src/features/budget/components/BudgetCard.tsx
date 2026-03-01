import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { BudgetItem } from "../types/budget.types";

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
    <View style={styles.swipeActions}>
      {/* Edit Action */}
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => onEdit(item)}
      >
        <Ionicons name="create" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Delete Action */}
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDelete}
      >
        <Ionicons name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={rightActions} overshootRight={false}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.color + "20" },
            ]}
          >
            <Text style={styles.iconText}>{getCategoryIcon(item.icon)}</Text>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.category}>{item.category}</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(percentUsed, 100)}%`,
                      backgroundColor: isOverBudget ? "#EF4444" : item.color,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.percentText,
                  { color: isOverBudget ? "#EF4444" : "#6B7280" },
                ]}
              >
                {percentUsed}%
              </Text>
            </View>
          </View>

          {/* Amounts */}
          <View style={styles.amountsContainer}>
            <Text style={styles.actualAmount}>
              ${item.actual.toLocaleString()}
            </Text>
            <Text style={styles.estimatedAmount}>
              of ${item.estimated.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          {/* Status */}
          <TouchableOpacity
            style={styles.statusContainer}
            onPress={() => onTogglePaid(item.id)}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.isPaid ? "#10B981" : "#F59E0B" },
              ]}
            />
            <Text style={styles.statusText}>
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
            style={[
              styles.remainingText,
              { color: isOverBudget ? "#EF4444" : "#10B981" },
            ]}
          >
            {isOverBudget ? "+" : "-"}${Math.abs(remaining).toLocaleString()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "500",
    minWidth: 36,
  },
  amountsContainer: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  actualAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  estimatedAmount: {
    fontSize: 12,
    color: "#6B7280",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statusContainer: {
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
    color: "#6B7280",
  },
  remainingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  swipeActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: "100%",
  },
  editButton: {
    backgroundColor: "#3B82F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
});
