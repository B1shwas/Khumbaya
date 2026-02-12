import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import type { Event } from "../types/events";
import { styles } from "../styles/Events.styles";
import { SubEventCard } from "./SubEventCard";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const handleEventPress = () => {
    router.push(
      `/events/${event.id}?isInvited=${!event.isMyEvent}` as RelativePathString,
    );
  };

  return (
    <View style={styles.eventCard}>
      <TouchableOpacity
        style={styles.eventCardTouchable}
        onPress={handleEventPress}
        activeOpacity={0.8}
      >
        <View style={styles.eventImageContainer}>
          <Image
            source={{ uri: event.imageUrl }}
            style={[styles.eventImage, event.isPast && styles.eventImagePast]}
          />
        </View>
        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <View
              style={[styles.statusBadge, event.isPast && styles.statusBadgePast]}
            >
              <Text
                style={[styles.statusText, event.isPast && styles.statusTextPast]}
              >
                {event.status}
              </Text>
            </View>
          </View>
          <View>
            <View style={styles.eventLocationRow}>
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text style={styles.eventLocation} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
            <View style={styles.eventDateRow}>
              <Ionicons
                name="calendar"
                size={14}
                color={event.isPast ? "#9CA3AF" : "#ee2b8c"}
              />
              <Text
                style={[styles.eventDate, event.isPast && styles.eventDatePast]}
              >
                {event.date} • {event.time}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Sub Events Section */}
      {event.subEvents && event.subEvents.length > 0 && (
        <View style={styles.subEventsSection}>
          <View style={styles.subEventsHeader}>
            <Text style={styles.subEventsTitle}>Sub Events</Text>
            <Text style={styles.subEventsCount}>
              {event.subEvents.length} scheduled
            </Text>
          </View>
          {event.subEvents.map((subEvent) => (
            <SubEventCard key={subEvent.id} subEvent={subEvent} />
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.eventActions}>
        {event.isMyEvent ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                router.push(
                  `/events/subevent-create?eventId=${event.id}` as RelativePathString,
                )
              }
            >
              <Ionicons name="add-circle-outline" size={18} color="#ee2b8c" />
              <Text style={styles.actionButtonText}>Add Sub Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                router.push(
                  `/events/table-management?eventId=${event.id}` as RelativePathString,
                )
              }
            >
              <Ionicons name="grid-outline" size={18} color="#3B82F6" />
              <Text style={styles.actionButtonText}>Manage Tables</Text>
            </TouchableOpacity>
          </>
        ) : (
          !event.isPast && (
            <TouchableOpacity
              style={[styles.actionButton, styles.rsvpButton]}
              onPress={() => {
                router.push(
                  `/events/rsvp?eventId=${event.id}` as RelativePathString,
                );
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#10B981"
              />
              <Text style={[styles.actionButtonText, styles.rsvpButtonText]}>
                RSVP Now
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};
