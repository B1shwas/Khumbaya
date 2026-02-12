import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/Budget.styles";

interface MainBudgetCardProps {
  totalEstimated: number;
  totalActual: number;
  percentUsed: number;
  isOverBudget: boolean;
}

export const MainBudgetCard: React.FC<MainBudgetCardProps> = ({
  totalEstimated,
  totalActual,
  percentUsed,
  isOverBudget,
}) => {
  return (
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
                backgroundColor: isOverBudget ? "#EF4444" : "#10B981",
              },
            ]}
          />
        </View>
        <Text style={styles.mainProgressText}>
          ${totalActual.toLocaleString()} spent ({percentUsed}%)
        </Text>
      </View>
    </View>
  );
};
