import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/EventCreate.styles";
import type { EventType } from "../../types/eventCreate";
import { EVENT_TYPES } from "../../types/eventCreate";

interface EventTypeSelectorProps {
  selectedType: EventType;
  onSelect: (type: EventType) => void;
}

export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>What type of event is it?</Text>
      <View style={styles.chipContainer}>
        {EVENT_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onSelect(type)}
            style={[styles.chip, selectedType === type && styles.chipSelected]}
          >
            <Text
              style={[
                styles.chipText,
                selectedType === type && styles.chipTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
