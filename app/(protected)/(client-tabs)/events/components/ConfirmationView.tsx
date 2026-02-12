import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import type { InvitedEvent, RSVPQuestion } from "../types/rsvp";
import { styles } from "./styles/RSVP.styles";

interface ConfirmationViewProps {
  event: InvitedEvent;
  attending: boolean | null;
  responses: Record<string, string | string[]>;
  questions: RSVPQuestion[];
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  event,
  attending,
  responses,
  questions,
}) => {
  return (
    <View style={styles.confirmationContainer}>
      <View style={styles.confirmationIcon}>
        {attending ? (
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        ) : (
          <Ionicons name="heart-dislike" size={80} color="#EF4444" />
        )}
      </View>

      <Text style={styles.confirmationTitle}>
        {attending ? "See You There! 🎉" : "We're Sorry to See You Go 💔"}
      </Text>

      <Text style={styles.confirmationMessage}>
        {attending
          ? `Your RSVP has been submitted. We look forward to seeing you on ${event.date}!`
          : `Your response has been noted. We're sorry you can't make it to ${event.title}.`}
      </Text>

      {/* Summary */}
      {attending && Object.keys(responses).length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Responses</Text>
          <View style={styles.summaryContent}>
            {questions.slice(0, 3).map((question) => {
              const answer = responses[question.id];
              if (!answer) return null;
              return (
                <View key={question.id} style={styles.summaryItem}>
                  <Text style={styles.summaryQuestion}>
                    {question.question}
                  </Text>
                  <Text style={styles.summaryAnswer}>
                    {Array.isArray(answer) ? answer.join(", ") : answer}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Event Details */}
      <View style={styles.confirmationEventCard}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.confirmationEventImage}
        />
        <View style={styles.confirmationEventInfo}>
          <Text style={styles.confirmationEventTitle}>{event.title}</Text>
          <Text style={styles.confirmationEventDate}>
            {event.date} • {event.time}
          </Text>
          <Text style={styles.confirmationEventLocation}>{event.location}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => {
          // Navigate back to events
        }}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addToCalendarButton}
        onPress={() => {
          Alert.alert("Calendar", "Event added to your calendar!");
        }}
      >
        <Ionicons name="calendar-outline" size={20} color="#ee2b8c" />
        <Text style={styles.addToCalendarText}>Add to Calendar</Text>
      </TouchableOpacity>
    </View>
  );
};
