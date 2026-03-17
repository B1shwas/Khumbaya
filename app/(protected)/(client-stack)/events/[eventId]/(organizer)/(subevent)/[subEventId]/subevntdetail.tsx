import { useSubEventsOfEvent } from "@/src/features/events/hooks/use-event";
import SubEventDetail from "@/src/screen/user/event/subevent/subeventdetail";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubEventDetailPage() {
  const { eventId, subEventId } = useLocalSearchParams();

  const {
    data: subEvents,
    isLoading,
    error,
  } = useSubEventsOfEvent(Number(eventId));

  const subEvent = useMemo<any>(() => {
    if (!subEvents || !subEventId) return null;
    return subEvents.find((se: any) => se.id === Number(subEventId)) || null;
  }, [subEvents, subEventId]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] dark:bg-[#221019] items-center justify-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="mt-2 text-gray-500">Loading subevent...</Text>
      </SafeAreaView>
    );
  }

  if (error || !subEvent) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] dark:bg-[#221019] items-center justify-center">
        <Text className="mt-4 text-lg font-semibold text-gray-700">
          Failed to load subevent
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SubEventDetail subEvent={subEvent} />
    </>
  );
}
