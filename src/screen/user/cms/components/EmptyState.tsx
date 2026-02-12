import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/CardMaking.styles";

interface EmptyStateProps {
  onCreateFirst: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateFirst }) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="card-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No cards yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to create your first card
      </Text>
      <TouchableOpacity
        style={styles.createFirstButton}
        onPress={onCreateFirst}
      >
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.createFirstButtonText}>Create Card</Text>
      </TouchableOpacity>
    </View>
  );
};
