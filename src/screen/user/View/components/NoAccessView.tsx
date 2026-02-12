import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/Budget.styles";

export const NoAccessView: React.FC = () => {
  return (
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
  );
};
