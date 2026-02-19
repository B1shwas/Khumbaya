import NavigateComponent from "@/src/components/event/NavigateComponent";
import { eventsData } from "@/src/constants/event";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
  type RelativePathString,
} from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import EventDetailHero from "./EventDetailHero";

const EventDetail = ({
  isInvitedGuest = false,
}: {
  isInvitedGuest?: boolean;
}) => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const found = eventsData.find((e) => String(e.id) === String(eventId));

  // Fallback shape so UI never crashes even if event not found
  const event = found ?? {
    id: eventId ?? "0",
    title: "Event Details",
    date: "—",
    location: "—",
    venue: "—",
    imageUrl: "",
    role: "Organizer" as const,
    status: "upcoming" as const,
    time: "",
    days: 0,
    hours: 0,
    minutes: 0,
    guests: { confirmed: 0, total: 0 },
    budget: { spent: 0, total: 0 },
    tasks: { pending: 0 },
    vendors: { booked: 0, pending: 0 },
    nextTask: "",
  };

  const manageActions = [
    {
      id: "timeline",
      name: "Timeline",
      icon: "time",
      color: "#F59E0B",
      route: `./timeline`,
    },
    {
      id: "guests",
      name: "Guest List",
      icon: "people",
      color: "#8B5CF6",
      route: `./guests`,
    },
    {
      id: "vendors",
      name: "Vendors",
      icon: "business",
      color: "#3B82F6",
      route: `./vendor`,
    },
    {
      id: "budget",
      name: "Budget",
      icon: "wallet",
      color: "#10B981",
      route: `./budget`,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background-light"
      showsVerticalScrollIndicator={false}
    >
      <EventDetailHero
        imageUrl={event.imageUrl}
        status={event.status}
        title={event.title}
        date={event.date}
        location={event.location}
      />

      {/* Quick Stats Row */}
      <View className="mt-6 px-4">
        <View className="flex-row items-center justify-between mb-3">
          {/* dark:text-white removed */}
          <Text className="text-lg font-bold">Quick Stats</Text>
          <TouchableOpacity>
            <Text className="text-sm font-semibold text-primary">View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {/* Guests Card */}
          {/* dark:bg-surface-dark and dark:border-gray-800 removed */}
          <View className="min-w-[160px] flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex-col items-center justify-center gap-2">
            <View className="relative h-16 w-16">
              {/* dark:border-gray-700 removed */}
              <View className="absolute inset-0 rounded-full border-4 border-gray-100" />
              <View
                className="absolute inset-0 rounded-full border-4 border-primary"
                style={{
                  borderBottomColor: "transparent",
                  borderRightColor: "transparent",
                  transform: [{ rotate: "270deg" }],
                }}
              />
              <View className="absolute inset-0 flex items-center justify-center">
                {/* dark:text-white removed */}
                <Text className="text-xs font-bold text-gray-700">75%</Text>
              </View>
            </View>
            <View className="text-center">
              {/* dark:text-white removed */}
              <Text className="text-sm font-bold text-gray-900">Guests</Text>
              <Text className="text-xs text-gray-500">150/200 Yes</Text>
            </View>
          </View>

          {/* Budget Card */}

          <View className="min-w-[160px] flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex-col justify-between">
            <View>
              <View className="bg-green-100 p-3 rounded-sm self-start">
                <Ionicons name="pricetag" size={20} color="#16A34A" />
              </View>
              {/* dark:text-white removed */}
              <Text className="text-sm font-bold mt-2 text-gray-900">
                Budget
              </Text>
              <Text className="text-xs text-gray-500">$12k / $30k</Text>
            </View>
            {/* dark:bg-gray-700 removed */}
            <View className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
              <View
                className="bg-primary h-1.5 rounded-full"
                style={{ width: "40%" }}
              />
            </View>
          </View>

          {/* Tasks Card */}
          {/* dark:bg-surface-dark and dark:border-gray-800 removed */}
          <View className="min-w-[160px] flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex-col justify-between">
            <View>
              {/* dark:bg-orange-900/30 and dark:text-orange-400 removed */}
              <View className="bg-orange-100 p-3 rounded-sm self-start">
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#EA580C"
                  className="text-orange-600"
                />
              </View>
              {/* dark:text-white removed */}
              <Text className="text-sm font-bold mt-2 text-gray-900">
                Tasks
              </Text>
              <Text className="text-xs text-gray-500">12 Pending</Text>
            </View>
            {/* dark:bg-gray-700 removed */}
            <View className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
              <View
                className="bg-orange-500 h-1.5 rounded-full"
                style={{ width: "65%" }}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Main Navigation Grid */}
      <View className="  mt-6 px-4 pb-4">
        {/* dark:text-white removed */}
        <Text className="text-lg font-bold mb-3">Manage Event</Text>
        <View className="flex-row flex-wrap gap-3 justify-center">
          {manageActions.map((action) => (
            <NavigateComponent key={action.id} {...action} />
          ))}

          {/* Gallery - Full Width */}
          <TouchableOpacity
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex-row items-center gap-4"
            onPress={() => router.push("./gallery" as RelativePathString)}
          >
            <View className="p-2.5 bg-primary/10 rounded-full shrink-0">
              <Ionicons name="images" size={20} color="#ee2b8c" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base">Gallery</Text>
              <Text className="text-xs text-gray-500">
                Upload & Share Photos
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Invited Guest Notice */}
      {isInvitedGuest && (
        <View className="mx-4 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <View className="flex-row items-center gap-6">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text className="text-sm text-blue-700 flex-shrink">
              You're viewing this event as a guest. Some features like budget
              management are only available to the event organizer.
            </Text>
          </View>
        </View>
      )}

      {/* Bottom spacer */}
      <View className="h-24" />
    </ScrollView>
  );
};
export default EventDetail;
