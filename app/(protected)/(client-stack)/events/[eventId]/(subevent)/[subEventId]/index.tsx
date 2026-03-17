import { useSubEventsOfEvent } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubEventDetailPage() {
  const router = useRouter();
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

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
        <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-lg font-semibold text-gray-700">
          Failed to load subevent
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-pink-500 rounded-lg"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
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
      <SafeAreaView className="flex-1 bg-[#f8f6f7] dark:bg-[#e1c0d1]">
        {/* Header */}
        <View className="px-4 py-3 flex-row items-center justify-between border-b border-pink-200">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text
                className="text-lg font-bold text-gray-900"
                numberOfLines={1}
              >
                {subEvent.title}
              </Text>
              <Text className="text-xs text-pink-500">
                {subEvent.type || "Sub-Event"}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View className="p-4">
            <View className="rounded-2xl overflow-hidden">
              {subEvent.imageUrl ? (
                <Image
                  source={{ uri: subEvent.imageUrl }}
                  className="w-full h-64"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-64 bg-pink-100 items-center justify-center">
                  <Ionicons name="image-outline" size={64} color="#f9a8d4" />
                </View>
              )}
              <View className="absolute bottom-4 left-4">
                <Text className="text-white text-xl font-bold">
                  {subEvent.date
                    ? formatDate(subEvent.date).split(",")[0]
                    : "TBD"}
                </Text>
                <Text className="text-white/80">
                  {subEvent.startDateTime
                    ? formatDate(subEvent.startDateTime).split(",")[1]
                    : "Time TBD"}{" "}
                  • {subEvent.location || "Location TBD"}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {subEvent.description && (
            <View className="px-4 mb-4">
              <Text className="text-gray-600 text-sm">
                {subEvent.description}
              </Text>
            </View>
          )}

          {/* Budget */}
          <View className="px-4 mb-6">
            <View className="bg-white dark:bg-gray-900 p-4 rounded-xl">
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-gray-500">Budget Overview</Text>
                <Text className="text-pink-500 font-bold">
                  ₹{subEvent.budget?.toLocaleString() || 0}
                </Text>
              </View>

              {subEvent.budget && subEvent.budget > 0 && (
                <>
                  <View className="h-2 bg-pink-100 rounded-full overflow-hidden">
                    <View className="bg-pink-500 w-[72%] h-full" />
                  </View>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-xs text-gray-500">
                      Spent: ₹
                      {Math.round(subEvent.budget * 0.72).toLocaleString()}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Remaining: ₹
                      {Math.round(subEvent.budget * 0.28).toLocaleString()}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Event Details */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold mb-4">Event Details</Text>

            <View className="bg-white dark:bg-gray-900 p-4 rounded-xl space-y-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="calendar-outline" size={20} color="#ec4899" />
                <View>
                  <Text className="text-xs text-gray-500">Date & Time</Text>
                  <Text className="font-medium">
                    {subEvent.startDateTime
                      ? formatDate(subEvent.startDateTime)
                      : "TBD"}
                  </Text>
                </View>
              </View>

              {subEvent.endDateTime && (
                <View className="flex-row items-center gap-3">
                  <Ionicons name="time-outline" size={20} color="#ec4899" />
                  <View>
                    <Text className="text-xs text-gray-500">End Time</Text>
                    <Text className="font-medium">
                      {formatDate(subEvent.endDateTime)}
                    </Text>
                  </View>
                </View>
              )}

              {subEvent.location && (
                <View className="flex-row items-center gap-3">
                  <Ionicons name="location-outline" size={20} color="#ec4899" />
                  <View>
                    <Text className="text-xs text-white-500">Location</Text>
                    <Text className="font-medium">{subEvent.location}</Text>
                  </View>
                </View>
              )}

              {subEvent.theme && (
                <View className="flex-row items-center gap-3">
                  <Ionicons
                    name="color-palette-outline"
                    size={20}
                    color="#ec4899"
                  />
                  <View>
                    <Text className="text-xs text-gray-500">Theme</Text>
                    <Text className="font-medium">{subEvent.theme}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Status */}
          <View className="px-4 mb-6">
            <View className="bg-white dark:bg-gray-900 p-4 rounded-xl">
              <Text className="text-xs text-gray-500 mb-1">Status</Text>
              <View
                className={`inline-block px-3 py-1 rounded-full ${
                  subEvent.status === "upcoming"
                    ? "bg-blue-100"
                    : subEvent.status === "ongoing"
                      ? "bg-green-100"
                      : subEvent.status === "completed"
                        ? "bg-gray-100"
                        : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium capitalize ${
                    subEvent.status === "upcoming"
                      ? "text-blue-700"
                      : subEvent.status === "ongoing"
                        ? "text-green-700"
                        : subEvent.status === "completed"
                          ? "text-gray-600"
                          : "text-red-600"
                  }`}
                >
                  {subEvent.status || "unknown"}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Button */}
          <View className="px-4 mb-10">
            <TouchableOpacity className="bg-black dark:bg-white p-4 rounded-xl flex-row justify-between items-center">
              <Text className="text-white dark:text-black font-bold">
                Sub-Event Settings
              </Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
