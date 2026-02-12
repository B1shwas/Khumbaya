import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/EventSuccess.styles";
import type { Event } from "../../types/eventSuccess";

interface SubEventsViewProps {
  event: Event;
  expandedSubEvents: string[];
  onBack: () => void;
  onCreateSubEvent: () => void;
  onToggleSubEvent: (subEventId: string) => void;
  onAddVendor: (subEventId: string) => void;
}

export const SubEventsView: React.FC<SubEventsViewProps> = ({
  event,
  expandedSubEvents,
  onBack,
  onCreateSubEvent,
  onToggleSubEvent,
  onAddVendor,
}) => {
  return (
    <View style={styles.content}>
      {/* Event Header */}
      <View style={styles.subEventHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.subEventTitle} numberOfLines={1}>
          {event.name}
        </Text>
      </View>

      {/* Add Sub Event Button */}
      <TouchableOpacity
        style={styles.addSubEventButton}
        onPress={onCreateSubEvent}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#ee2b8c" />
        <Text style={styles.addSubEventText}>Add Sub Event</Text>
      </TouchableOpacity>

      {/* Sub Events List */}
      <ScrollView
        style={styles.subEventsList}
        showsVerticalScrollIndicator={false}
      >
        {event.subEvents.map((subEvent) => (
          <View key={subEvent.id} style={styles.subEventCard}>
            <TouchableOpacity
              style={styles.subEventHeader}
              onPress={() => onToggleSubEvent(subEvent.id)}
              activeOpacity={0.8}
            >
              <View style={styles.subEventInfo}>
                <Text style={styles.subEventName}>{subEvent.name}</Text>
                <Text style={styles.subEventVendorCount}>
                  {subEvent.vendors.length} vendor
                  {subEvent.vendors.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <Ionicons
                name={
                  expandedSubEvents.includes(subEvent.id)
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {expandedSubEvents.includes(subEvent.id) && (
              <View style={styles.subEventDetails}>
                {/* Vendors List */}
                {subEvent.vendors.length > 0 ? (
                  subEvent.vendors.map((vendor) => (
                    <View key={vendor.id} style={styles.vendorItem}>
                      <View style={styles.vendorInfo}>
                        <Ionicons name="person" size={16} color="#6B7280" />
                        <Text style={styles.vendorName}>{vendor.name}</Text>
                      </View>
                      <View
                        style={[
                          styles.vendorStatus,
                          vendor.status === "Booked"
                            ? styles.statusBooked
                            : styles.statusPending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.vendorStatusText,
                            vendor.status === "Booked"
                              ? styles.statusBookedText
                              : styles.statusPendingText,
                          ]}
                        >
                          {vendor.status}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noVendorsText}>No vendors added yet</Text>
                )}

                {/* Add Vendor Button */}
                <TouchableOpacity
                  style={styles.addVendorButton}
                  onPress={() => onAddVendor(subEvent.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#ee2b8c"
                  />
                  <Text style={styles.addVendorText}>Add Vendor</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {event.subEvents.length === 0 && (
          <View style={styles.emptySubEvents}>
            <Ionicons name="layers-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptySubEventsText}>No sub-events yet</Text>
            <Text style={styles.emptySubEventsSubText}>
              Tap "Add Sub Event" to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
