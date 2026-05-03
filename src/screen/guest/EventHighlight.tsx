import { Text } from "@/src/components/ui/Text";
import { useEventById, useSubEventsOfEvent } from "@/src/features/events/hooks/use-event";
import { formatDate } from "@/src/utils/helper";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventHighlightTimeline from "@/src/components/event/EventHighlightTimeline";

export default function EventHighlight() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data: subEvents, isLoading: subEventsLoading } = useSubEventsOfEvent(
    Number(eventId)
  );

  const { data: eventDetails, isLoading: eventLoading } =
    useEventById(Number(eventId));

  const isLoading = subEventsLoading || eventLoading;

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Title Section */}
        <View className="px-5 py-5">
          <Text variant="h1" className="text-lg mb-2">
            {eventDetails?.title || "Event Highlights"}
          </Text>
          <Text variant="body" className="text-gray-500">
            Key moments and schedule
          </Text>
        </View>

        {/* Highlights Section */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#ee2b8c" />
          </View>
        ) : (
          <EventHighlightTimeline highlights={subEvents || []} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
