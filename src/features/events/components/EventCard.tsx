import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../styles/RSVP.styles";
import type { InvitedEvent } from "../types/rsvp";

interface EventCardProps {
  event: InvitedEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <View style={styles.eventCard}>
      <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventDetailRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.eventDetailText}>
            {event.date} • {event.time}
          </Text>
        </View>
        <View style={styles.eventDetailRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.eventDetailText}>{event.location}</Text>
        </View>
        <Text style={styles.hostedBy}>Hosted by {event.hostName}</Text>
      </View>
    </View>
  );
};
