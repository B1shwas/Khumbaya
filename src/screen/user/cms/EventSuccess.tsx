import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  EventsListView,
  SubEventsView,
  SuccessView,
} from "./components/eventSuccess";
import { useEventSuccess } from "./hooks/useEventSuccess";
import { styles } from "./styles/EventSuccess.styles";
import { MOCK_EVENTS } from "./types/eventSuccess";

export default function EventSuccess() {
  const router = useRouter();
  const {
    viewMode,
    selectedEvent,
    handleBackToSuccess,
    handleBackToEvents,
    handleEventPress,
    handleCreateSubEvent,
    handleViewMyEvents,
    handleAddVendor,
    toggleSubEvent,
  } = useEventSuccess();

  const handleClose = () => {
    router.replace("/(protected)/(client-tabs)/events" as any);
  };

  return (
    <View style={styles.container}>
      {/* Header / Close Button */}
      <View style={styles.header}>
        {viewMode !== "success" ? (
          <TouchableOpacity
            onPress={handleBackToSuccess}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color="#181114" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#181114" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {viewMode === "success"
            ? "Success"
            : viewMode === "events"
              ? "My Events"
              : "Sub Events"}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === "success" && (
          <SuccessView
            onCreateSubEvent={handleCreateSubEvent}
            onViewMyEvents={handleViewMyEvents}
          />
        )}
        {viewMode === "events" && (
          <EventsListView
            events={MOCK_EVENTS}
            onEventPress={handleEventPress}
          />
        )}
        {viewMode === "subevent" && selectedEvent && (
          <SubEventsView
            event={selectedEvent}
            expandedSubEvents={[]}
            onBack={handleBackToEvents}
            onCreateSubEvent={handleCreateSubEvent}
            onToggleSubEvent={toggleSubEvent}
            onAddVendor={handleAddVendor}
          />
        )}
      </ScrollView>
    </View>
  );
}
