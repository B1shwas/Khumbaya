import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/EventSuccess.styles";
import type { Event } from "../../types/eventSuccess";

interface EventsListViewProps {
  events: Event[];
  onEventPress: (event: Event) => void;
}

export const EventsListView: React.FC<EventsListViewProps> = ({
  events,
  onEventPress,
}) => {
  return (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>My Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => onEventPress(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <View style={styles.eventSubEvents}>
                <Ionicons name="layers" size={14} color="#9CA3AF" />
                <Text style={styles.eventSubEventsText}>
                  {item.subEvents.length} sub-events
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsList}
      />
    </View>
  );
};
