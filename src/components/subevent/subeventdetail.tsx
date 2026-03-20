import { Text } from "@/src/components/ui/Text";
import { useEventById } from "@/src/features/events/hooks/use-event";
import { formatTime } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubEventDetailScreen() {
  const { subEventId } = useLocalSearchParams<{
    subEventId: string;
    eventId: string;
  }>();

  const parsedSubEventId = Number(subEventId);

  const { data: subEvent, isLoading } = useEventById(parsedSubEventId);

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
      </SafeAreaView>
    );
  }

  const spent = subEvent?.budget ? subEvent.budget * 0.7 : 0;
  const percent = subEvent?.budget
    ? Math.min((spent / subEvent.budget) * 100, 100)
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative mx-4 mt-0 rounded-2xl overflow-hidden shadow-lg">
          {subEvent?.imageUrl ? (
            <Image
              source={{ uri: subEvent.imageUrl }}
              className="w-full h-64"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-64 bg-pink-50 items-center justify-center">
              <Ionicons name="image-outline" size={64} color="#f9a8d4" />
            </View>
          )}

          <View className="absolute bottom-0 left-0 right-0 h-32 bg-black/50" />

          <View className="absolute bottom-4 left-4 right-4">
            <View className="self-start bg-pink-500 px-3 py-1 rounded-full mb-2">
              <Text className="text-white text-xs font-semibold">
                SUB-EVENT
              </Text>
            </View>

            {/* Title and Status - Horizontal */}
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-xl font-bold flex-1">
                {subEvent?.title}
              </Text>
              <Text className="text-white text-lg font-medium ml-2">
                {subEvent?.status}
              </Text>
            </View>

            {/* Time + Location */}
            <Text className="text-white/90 text-sm mt-1">
              {formatTime(subEvent?.startDateTime)}
              {subEvent?.location && ` • ${subEvent.location}`}
            </Text>
          </View>
        </View>

        {/* 📝 DESCRIPTION */}
        <View className="px-4 pb-4">
          {subEvent?.description && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-500 uppercase mb-1 mt-4">
                Description
              </Text>
              <Text className="text-sm text-gray-700 leading-relaxed">
                {subEvent.description}
              </Text>
            </View>
          )}

          {/* 💰 BUDGET */}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
