import { Text } from "@/src/components/ui/Text";
import { SubEvent } from "@/src/constants/event";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  subEvent: SubEvent;
  eventId: string | number; // ✅ IMPORTANT for navigation
}

export default function SubEventDetail({ subEvent, eventId }: Props) {
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";

    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // ✅ Dynamic progress (replace fake 72%)
  const spent = subEvent?.budget ? subEvent.budget * 0.7 : 0; // temp logic
  const percent = subEvent?.budget
    ? Math.min((spent / subEvent.budget) * 100, 100)
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
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

          <View className="absolute bottom-3 left-4">
            <Text className="text-white text-xl font-bold">
              {formatShortDate(subEvent?.date || subEvent?.startDateTime)}
            </Text>
            <Text className="text-white/80 text-sm">
              {formatTime(subEvent?.startDateTime)} •{" "}
              {subEvent?.location || "Location TBD"}
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900">
            {subEvent?.title}
          </Text>

          {/* Type + Status */}
          <View className="flex-row items-center gap-2 mt-1 mb-4">
            <View className="px-2 py-0.5 bg-pink-100 rounded-full">
              <Text className="text-xs text-pink-600 font-medium">
                {subEvent?.type || "Sub-Event"}
              </Text>
            </View>

            {subEvent?.status && (
              <View className="px-2 py-0.5 rounded-full bg-gray-100">
                <Text className="text-xs font-medium capitalize text-gray-700">
                  {subEvent.status}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {subEvent?.description && (
            <Text className="text-sm text-black-600 mb-4">
              {subEvent.description}
            </Text>
          )}

          {/* Budget */}
          {subEvent?.budget && subEvent.budget > 0 && (
            <View className="bg-gray-50 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-500">Budget</Text>
                <Text className="text-lg font-bold text-pink-600">
                  ₹{subEvent.budget?.toLocaleString()}
                </Text>
              </View>

              <View className="h-2 bg-pink-100 rounded-full overflow-hidden">
                <View
                  className="bg-pink-500 h-full"
                  style={{ width: `${percent}%` }}
                />
              </View>
            </View>
          )}

          {/* Details */}
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="text-sm text-gray-500 mb-2">Event Details</Text>

            <Text className="text-sm font-medium">
              {formatDate(subEvent?.startDateTime)}
            </Text>

            {subEvent?.location && (
              <Text className="text-sm text-gray-600 mt-1">
                📍 {subEvent.location}
              </Text>
            )}
          </View>

          {/* Settings Button */}
          <TouchableOpacity
            className="bg-black p-4 rounded-xl flex-row justify-between items-center"
            onPress={() =>
              router.push({
                pathname:
                  "/(protected)/(client-stack)/events/[eventId]/(organizer)/settings",
                params: {
                  eventId,
                },
              })
            }
          >
            <Text className="text-white font-semibold">Sub-Event Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
