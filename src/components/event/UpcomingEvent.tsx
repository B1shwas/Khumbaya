import Card from "@/src/components/ui/Card";
import { Event, EventRole } from "@/src/constants/event";
import { usegetUpcomingEvents } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

interface UpcomingEventsTabProps {
  isActive: boolean;
}

const roleConfig: Record<
  EventRole,
  { wrapperClass: string; textClass: string }
> = {
  Organizer: {
    wrapperClass: "bg-purple-100 px-2 py-1 rounded-full",
    textClass: "text-xs font-medium text-purple-700",
  },
  Vendor: {
    wrapperClass: "bg-blue-100 px-2 py-1 rounded-full",
    textClass: "text-xs font-medium text-blue-700",
  },
  Guest: {
    wrapperClass: "bg-green-100 px-2 py-1 rounded-full",
    textClass: "text-xs font-medium text-green-700",
  },
};

const defaultRoleStyle = {
  wrapperClass: "bg-gray-100 px-2 py-1 rounded-full",
  textClass: "text-xs font-medium text-gray-700",
};
const UpcomingEventItem = ({
  event,
  onPress,
}: {
  event: Event;
  onPress: () => void;
}) => {

  const roleStyle = roleConfig[event.role as EventRole] ?? defaultRoleStyle;
  const roleLabel = event.role ?? "Unknown";
  const { wrapperClass, textClass } = roleStyle;
  return (
    <Card className="my-2">
      <Pressable
        className="flex-row p-3 rounded-md overflow-hidden"
        onPress={onPress}
      >
        <View className="w-20 h-20 rounded-lg overflow-hidden">
          <Image source={{ uri: event.imageUrl }} className="w-full h-full" />
        </View>
        <View className="flex-1 ml-3 justify-between">
          <View className="flex-row justify-between items-start">
            <Text
              className="font-jakarta-bold  text-text-light  text-nowrap flex-1 mr-2"
              numberOfLines={2}
            >
              {event.title}
            </Text>
            <View className={wrapperClass}>
              <Text className={textClass}>{roleLabel}</Text>
            </View>
          </View>
          <View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text
                className="font-jakarta text-[13px] text-text-tertiary ml-1"
                numberOfLines={1}
              >
                {event.location}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Ionicons name="calendar" size={14} color={"#ee2b8c"} />
              <Text className="font-jakarta-semibold text-[13px] text-primary ml-1">
                {event.date} • {event.time}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

export const UpcomingEventsTab = ({ isActive }: UpcomingEventsTabProps) => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    data: eventsData = [],
    isLoading,
    isError,
    refetch,
  } = usegetUpcomingEvents({ enabled: isActive });

  const events = (eventsData as Event[]).filter((event) => {
    if (event.status === "upcoming") return true;
    const endDate = event.endDateTime ? new Date(event.endDateTime) : undefined;
    return !endDate || Number.isNaN(endDate.getTime()) || endDate >= new Date();
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  useEffect(() => {
    setMounted(true);
  })
  if (!isActive && !mounted) {
    return <>
      Loading
    </>;
  }
  return (
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
      ) : events.length > 0 ? (
        events.map((event) => (
          <UpcomingEventItem
            key={event.id}
            event={event}
            onPress={() => {
              router.push(`/(protected)/(client-stack)/events/${event.id}`);
            }}
          />
        ))
      ) : (
        <View className="items-center justify-center mt-24">
          <Ionicons name="calendar-outline" size={52} color="#d1d5db" />
          <Text className="text-gray-400 text-base font-medium mt-4">
            No events found
          </Text>
          <Text className="text-gray-400 text-sm mt-1 text-center px-8">
            Create your first event to get started
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
