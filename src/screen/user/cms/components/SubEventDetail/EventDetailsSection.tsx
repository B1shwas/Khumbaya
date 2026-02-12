import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface EventDetailsSectionProps {
  date: string;
  theme: string;
  budget: string;
  onDateChange: (value: string) => void;
  onThemeChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  date,
  theme,
  budget,
  onDateChange,
  onThemeChange,
  onBudgetChange,
}) => {
  return (
    <View style={localStyles.section}>
      <Text style={localStyles.sectionTitle}>Event Details</Text>

      <View style={localStyles.inputContainer}>
        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
        <TextInput
          style={localStyles.textInput}
          placeholder="Date (e.g., 15th March 2025)"
          placeholderTextColor="#9CA3AF"
          value={date}
          onChangeText={onDateChange}
        />
      </View>

      <View style={localStyles.inputContainer}>
        <Ionicons name="color-palette-outline" size={20} color="#6B7280" />
        <TextInput
          style={localStyles.textInput}
          placeholder="Theme (e.g., Royal, Traditional)"
          placeholderTextColor="#9CA3AF"
          value={theme}
          onChangeText={onThemeChange}
        />
      </View>

      <View style={localStyles.inputContainer}>
        <Ionicons name="wallet-outline" size={20} color="#6B7280" />
        <TextInput
          style={localStyles.textInput}
          placeholder="Total Budget (e.g., $5000)"
          placeholderTextColor="#9CA3AF"
          value={budget}
          onChangeText={onBudgetChange}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

import { Text } from "react-native";

const localStyles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
  },
});
