import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/RSVP.styles";
import type { SubEvent } from "../types/rsvp";

interface SubEventCardProps {
  subEvent: SubEvent;
}

export const SubEventCard: React.FC<SubEventCardProps> = ({ subEvent }) => {
  return (
    <View style={styles.subEventCard}>
      <View style={styles.subEventIcon}>
        <Ionicons name={subEvent.icon as any} size={20} color="#ee2b8c" />
      </View>
      <View style={styles.subEventInfo}>
        <Text style={styles.subEventName}>{subEvent.name}</Text>
        <Text style={styles.subEventTime}>
          {subEvent.date} • {subEvent.time}
        </Text>
      </View>
    </View>
  );
};
