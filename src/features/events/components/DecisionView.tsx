import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/RSVP.styles";
import type { InvitedEvent, SubEvent } from "../types/rsvp";
import { EventCard } from "./EventCard";
import { SubEventCard } from "./SubEventCard";

interface DecisionViewProps {
  event: InvitedEvent;
  onDecision: (attending: boolean) => void;
}

export const DecisionView: React.FC<DecisionViewProps> = ({
  event,
  onDecision,
}) => {
  return (
    <View style={styles.decisionContainer}>
      {/* Event Info */}
      <EventCard event={event} />

      {/* Sub Events */}
      {event.subEvents && event.subEvents.length > 0 && (
        <View style={styles.subEventsSection}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          {event.subEvents.map((subEvent: SubEvent) => (
            <SubEventCard key={subEvent.id} subEvent={subEvent} />
          ))}
        </View>
      )}

      {/* Decision */}
      <Text style={styles.decisionTitle}>Will you be attending?</Text>

      <TouchableOpacity
        style={styles.decisionButton}
        onPress={() => onDecision(true)}
      >
        <View style={styles.decisionIconContainer}>
          <Ionicons name="checkmark-circle" size={48} color="#10B981" />
        </View>
        <Text style={styles.decisionButtonTitle}>Yes, I'll be there!</Text>
        <Text style={styles.decisionButtonSubtitle}>
          I'd love to celebrate with you
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.decisionButton, styles.decisionButtonDecline]}
        onPress={() => onDecision(false)}
      >
        <View
          style={[
            styles.decisionIconContainer,
            styles.decisionIconContainerDecline,
          ]}
        >
          <Ionicons name="close-circle" size={48} color="#EF4444" />
        </View>
        <Text
          style={[
            styles.decisionButtonTitle,
            styles.decisionButtonTitleDecline,
          ]}
        >
          No, I can't make it
        </Text>
        <Text style={styles.decisionButtonSubtitleDecline}>
          Unfortunately, I won't be able to attend
        </Text>
      </TouchableOpacity>
    </View>
  );
};
