import React from "react";
import { View, Text } from "react-native";
import type { BudgetItem } from "../types/budget";
import { getCategoryIcon } from "../types/budget";
import { styles } from "../styles/Budget.styles";

interface BudgetItemComponentProps {
  item: BudgetItem;
}

export const BudgetItemComponent: React.FC<BudgetItemComponentProps> = ({ item }) => {
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
