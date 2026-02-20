import Card from "@/src/components/ui/Card";
import { Event, EventRole, eventsData, EventTab } from "@/src/constants/event";
import { cn } from "@/src/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const EventCard = ({
  event,
  onPress,
  isRequest,
  asGuest,
}: {
  event: Event;
  onPress: () => void;
  isRequest?: boolean;
  asGuest?: boolean;
}) => {
  const router = useRouter();
  const { wrapperClass, textClass } = roleConfig[event.role];

  return (
    <Card className="my-2">
      <Pressable
        className="flex-row p-3 rounded-md overflow-hidden"
        onPress={() => {
          if (isRequest && asGuest) {
            router.push(
              `/(protected)/(client-stack)/events/${event.id}/(guest)/rsvp`,
            );
          } else if (isRequest && !asGuest) {
            router.push(
              `/(protected)/(client-stack)/events/${event.id}/(vendor)/`,
            );
          } else {
            router.push(`/(protected)/(client-stack)/events/${event.id}`);
          }
        }}
      >
        <View className="w-20 h-20 rounded-lg overflow-hidden">
          <Image source={{ uri: event.imageUrl }} className="w-full h-full" />
        </View>
        <View className="flex-1 ml-3 justify-between">
          <View className="flex-row justify-between items-start">
            <Text
              className="font-jakarta-bold text-base text-text-light flex-1 mr-2"
              numberOfLines={2}
            >
              {event.title}
            </Text>
            <View className={wrapperClass}>
              <Text className={textClass}>{event.role}</Text>
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
      {isRequest && !asGuest && (
        <View className="border-t border-border mx-3 mt-1 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="bg-blue-50 p-1.5 rounded-full">
                <Ionicons name="briefcase-outline" size={14} color="#3B82F6" />
              </View>
              <Text className="font-jakarta-semibold text-xs text-blue-700">
                Vendor booking request
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-primary px-3 py-1.5 rounded-full"
                onPress={() =>
                  router.push(
                    `/(protected)/(client-stack)/events/${event.id}/(vendor)/`,
                  )
                }
              >
                <Text className="font-jakarta-semibold text-xs text-white">
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-border px-3 py-1.5 rounded-full">
                <Text className="font-jakarta-semibold text-xs text-text-secondary">
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {isRequest && asGuest && (
        <View className="border-t border-border mx-3 mt-1 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="bg-pink-50 p-1.5 rounded-full">
                <Ionicons name="mail-outline" size={14} color="#ee2b8c" />
              </View>
              <Text className="font-jakarta-semibold text-xs text-primary">
                You're invited — RSVP now
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-primary px-3 py-1.5 rounded-full"
                onPress={() =>
                  router.push(
                    `/(protected)/(client-stack)/events/${event.id}/rsvp`,
                  )
                }
              >
                <Text className="font-jakarta-semibold text-xs text-white">
                  Going
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-border px-3 py-1.5 rounded-full">
                <Text className="font-jakarta-semibold text-xs text-text-secondary">
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Card>
  );
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const tabs: { label: string; value: EventTab }[] = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Invited", value: "invited" },
    { label: "Completed", value: "completed" },
  ];

  const filteredEvents = eventsData.filter((e) => e.status === activeTab);

  const emptyMessage: Record<EventTab, string> = {
    upcoming: "Create your first event to get started",
    invited: "No pending invitations",
    completed: "No completed events",
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
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
