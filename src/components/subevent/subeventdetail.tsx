import { Text } from "@/src/components/ui/Text";
import { useEventById } from "@/src/features/events/hooks/use-event";
import {
  formatFullDateTime,
  formatShortDayDate,
  formatTime,
} from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SubEventData {
  id: number;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  date: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  budget: number;
  theme: string;
  status: string;
  organizer: number;
  parentId: number;
  createdAt: string;
  updatedAt: string;
}

export default function SubEventDetailScreen() {
  const router = useRouter();
  const { subEventId, eventId } = useLocalSearchParams();

  const parsedSubEventId = Number(subEventId);
  const isValidId = !isNaN(parsedSubEventId) && parsedSubEventId > 0;

  const { data: subEvent, isLoading } = useEventById(parsedSubEventId, {
    enabled: isValidId,
  });

  // Show error if ID is invalid
  if (!isValidId) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-3 text-lg font-semibold text-gray-800 text-center">
          Invalid Sub-Event ID
        </Text>
        <Text className="mt-1 text-sm text-gray-500 text-center">
          The sub-event ID is missing or invalid.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-pink-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Validate that this is actually a sub-event (has parentId)
  if (subEvent && !subEvent.parentId) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-3 text-lg font-semibold text-gray-800 text-center">
          Invalid Request
        </Text>
        <Text className="mt-1 text-sm text-gray-500 text-center">
          This is a main event, not a sub-event.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-pink-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#f43f5e" />
        <Text className="mt-3 text-gray-500">Loading sub-event...</Text>
      </SafeAreaView>
    );
  }

  if (!subEvent) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-3 text-lg font-semibold text-gray-800 text-center">
          Sub-event not found
        </Text>
        <Text className="mt-1 text-sm text-gray-500 text-center">
          This sub-event may have been deleted or doesn't exist.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-pink-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const spent = subEvent?.budget ? subEvent.budget * 0.7 : 0;
  const percent = subEvent?.budget
    ? Math.min((spent / subEvent.budget) * 100, 100)
    : 0;

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          {subEvent?.imageUrl ? (
            <Image
              source={{ uri: subEvent.imageUrl }}
              className="w-full h-56"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-56 bg-pink-50 items-center justify-center">
              <Ionicons name="image-outline" size={64} color="#f9a8d4" />
            </View>
          )}

          <View className="absolute bottom-3 left-4 bg-white/90 px-3 py-2 rounded-lg">
            <Text className="text-dark text-base font-semibold">
              {formatShortDayDate(subEvent?.startDateTime)}
            </Text>
            <Text className="text-dark/70 text-sm">
              {formatTime(subEvent?.startDateTime, "")}
              {subEvent?.endDateTime &&
                ` - ${formatTime(subEvent.endDateTime, "")}`}
              {" • "}
              {subEvent?.location || "Location TBD"}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-2xl font-bold text-dark-900">
            {subEvent?.title}
          </Text>

          <View className="flex-row items-center gap-2 mt-2 mb-4">
            <View className="px-3 py-1 bg-pink-100 rounded-full">
              <Text className="text-xs text-pink-600 font-medium">
                {subEvent?.type || "Sub-Event"}
              </Text>
            </View>

            {subEvent?.status && (
              <View className="px-3 py-1 rounded-full bg-green-100">
                <Text className="text-xs font-medium capitalize text-green-700">
                  {subEvent.status}
                </Text>
              </View>
            )}
          </View>

          {subEvent?.description && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Description
              </Text>
              <Text className="text-sm text-gray-700 leading-relaxed">
                {subEvent.description}
              </Text>
            </View>
          )}

          {subEvent?.budget && subEvent.budget > 0 && (
            <View className="bg-gray-50 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <View>
                  <Text className="text-sm text-gray-500">Budget</Text>
                  <Text className="text-xl font-bold text-pink-600">
                    ₹{subEvent.budget?.toLocaleString()}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-gray-500">Spent</Text>
                  <Text className="text-sm font-semibold text-gray-700">
                    ₹{spent.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View className="h-2 bg-pink-100 rounded-full overflow-hidden">
                <View
                  className="bg-pink-500 h-full"
                  style={{ width: `${percent}%` }}
                />
              </View>
              <Text className="text-xs text-gray-400 mt-1">
                {percent.toFixed(0)}% utilized
              </Text>
            </View>
          )}

          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              📅 Date & Time
            </Text>

            <View className="flex-row items-start gap-3">
              <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800">
                  {formatFullDateTime(subEvent?.startDateTime)}
                </Text>
                {subEvent?.endDateTime && (
                  <Text className="text-sm text-gray-500 mt-0.5">
                    Ends: {formatFullDateTime(subEvent.endDateTime)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              📍 Location
            </Text>

            {subEvent?.location ? (
              <View className="flex-row items-start gap-3">
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800">
                    {subEvent.location}
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="text-sm text-gray-400 italic">
                Location not specified
              </Text>
            )}
          </View>

          <View className="mt-2 gap-3">
            <TouchableOpacity
              className="bg-gray-900 p-4 rounded-xl flex-row justify-between items-center"
              onPress={() =>
                router.push({
                  pathname:
                    "/(protected)/(client-stack)/events/[eventId]/(organizer)/settings",
                  params: { eventId: String(eventId) },
                })
              }
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text className="text-white font-semibold">
                  Sub-Event Settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 p-4 rounded-xl flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <Ionicons name="people-outline" size={20} color="#374151" />
                <Text className="text-gray-700 font-semibold">
                  Manage Vendors
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 p-4 rounded-xl flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <Ionicons name="person-add-outline" size={20} color="#374151" />
                <Text className="text-gray-700 font-semibold">Guest List</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 p-4 rounded-xl flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <Ionicons name="time-outline" size={20} color="#374151" />
                <Text className="text-gray-700 font-semibold">
                  Timeline / Agenda
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 p-4 rounded-xl flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <Ionicons name="checkbox-outline" size={20} color="#374151" />
                <Text className="text-gray-700 font-semibold">
                  Tasks & Checklist
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View className="mt-6 pt-4 border-t border-gray-100">
            <Text className="text-xs text-gray-400 text-center">
              Sub-Event ID: {subEvent?.id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
