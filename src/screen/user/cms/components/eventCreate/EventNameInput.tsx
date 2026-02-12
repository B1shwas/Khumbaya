import React from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "../../styles/EventCreate.styles";

interface EventNameInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const EventNameInput: React.FC<EventNameInputProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Event Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="e.g., Aisha & Omar's Wedding"
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};
