import { Event_WITH_ROLE } from "@/src/components/home/EventCardTab";
import { Event, EventTab } from "@/src/constants/event";
import {
  useGetEventWithRole,
  useGetInvitedEvents,
} from "@/src/features/events/hooks/use-event";
import { cn } from "@/src/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const {
    data: eventsData = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    refetch: refetchEvents,
  } = useGetEventWithRole();
  const {
    data: invitedEventsData = [],
    isLoading: isInvitedLoading,
    isError: isInvitedError,
    refetch: refetchInvited,
  } = useGetInvitedEvents();

  const tabs: { label: string; value: EventTab }[] = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Invited", value: "invited" },
    { label: "Completed", value: "completed" },
  ];
  const getEventStatus = (event: Event): EventTab => {
    if (
      event.status === "upcoming" ||
      event.status === "invited" ||
      event.status === "completed"
    ) {
      return event.status;
    }

    const eventWithDates = event as Event & {
      startDate?: string;
      endDate?: string;
    };

    const endDate = eventWithDates.endDate
      ? new Date(eventWithDates.endDate)
      : undefined;

    if (endDate && !Number.isNaN(endDate.getTime()) && endDate < new Date()) {
      return "completed";
    }

    return "upcoming";
  };

  const filteredEvents =
    activeTab === "invited"
      ? (invitedEventsData as Event[]).filter(
          (event) => getEventStatus(event) === "invited"
        )
      : (eventsData as Event[]).filter(
          (event) => getEventStatus(event) === activeTab
        );

  const isLoading =
    activeTab === "invited" ? isInvitedLoading : isEventsLoading;
  const isError = activeTab === "invited" ? isInvitedError : isEventsError;

  const emptyMessage: Record<EventTab, string> = {
    upcoming: "Create your first event to get started",
    invited: "No pending invitations",
    completed: "No completed events",
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchEvents(), refetchInvited()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-xl font-bold text-gray-900">Your Events</Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(protected)/(client-tabs)/profile");
          }}
          className="w-9 h-9 rounded-full bg-gray-200 items-center justify-center"
        >
          <Ionicons name="person-outline" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row p-1 mb-4 gap-2 bg-background-tertiary !rounded-md">
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 py-2 rounded-md items-center",
              activeTab === tab.value ? "bg-white" : "text-gray-600"
            )}
          >
            <Text
              className={cn(
                "text-sm font-jakarta-semibold p-1",
                activeTab === tab.value ? "text-primary" : "text-gray-500"
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Event List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isLoading ? (
          <View className="items-center justify-center mt-24">
            <Text className="text-gray-400 text-base font-medium mt-4">
              Loading events...
            </Text>
          </View>
        ) : isError ? (
          <View className="items-center justify-center mt-24">
            <Text className="text-gray-400 text-base font-medium mt-4">
              Failed to load events
            </Text>
          </View>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event: Event) => (
            <Event_WITH_ROLE
              key={event.id}
              event={event}
              onPress={() => {
                router.push(`/(protected)/(client-stack)/events/${event.id}`);
              }}
              isRequest={event.status === "invited"}
              asGuest={event.status === "invited" && event.role === "Guest"}
            />
          ))
        ) : (
          <View className="items-center justify-center mt-24">
            <Ionicons name="calendar-outline" size={52} color="#d1d5db" />
            <Text className="text-gray-400 text-base font-medium mt-4">
              No events found
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center px-8">
              {emptyMessage[activeTab]}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => {
          router.push("/(protected)/(client-stack)/events/create");
        }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
