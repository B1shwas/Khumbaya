import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/Budget.styles";

interface StatsGridProps {
  totalPaid: number;
  totalActual: number;
  remaining: number;
  categoriesCount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalPaid,
  totalActual,
  remaining,
  categoriesCount,
}) => {
  return (
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
        <Text style={styles.statValue}>
          ${(totalActual - totalPaid).toLocaleString()}
        </Text>
        <Text style={styles.statLabel}>Pending</Text>
      </View>
      <View style={[styles.statCard, styles.statCardOrange]}>
        <View style={styles.statIconContainer}>
          <Ionicons name="wallet" size={24} color="#F59E0B" />
        </View>
        <Text style={styles.statValue}>${remaining.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Remaining</Text>
      </View>
      <View style={[styles.statCard, styles.statCardPurple]}>
        <View style={styles.statIconContainer}>
          <Ionicons name="pie-chart" size={24} color="#8B5CF6" />
        </View>
        <Text style={styles.statValue}>{categoriesCount}</Text>
        <Text style={styles.statLabel}>Categories</Text>
      </View>
    </View>
  );
};
