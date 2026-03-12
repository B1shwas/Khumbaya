import { useSubEventsOfEvent } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface SubEvent {
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

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
};

export default function ListSubEvent() {
  const router = useRouter();

  const { eventId } = useLocalSearchParams();
  const { data: subEvents, isLoading, refetch } = useSubEventsOfEvent(
    Number(eventId)
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderSubEventCard = ({ item }: { item: SubEvent }) => {
    const statusStyle =
      STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-600";
    const [bgClass, textClass] = statusStyle.split(" ");

    return (
      <TouchableOpacity
        className="bg-white rounded-2xl mb-3 overflow-hidden border border-gray-100 shadow-sm"
        activeOpacity={0.85}
        onPress={() => {
          // Navigate to sub-event details
        }}
      >
        {/* Cover Image */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-36"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-36 bg-pink-50 items-center justify-center">
            <Ionicons name="layers-outline" size={40} color="#f9a8d4" />
          </View>
        )}

        <View className="p-4">
          {/* Title + Status */}
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-semibold text-gray-900 flex-1 mr-2">
              {item.title}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${bgClass}`}>
              <Text className={`text-xs font-medium capitalize ${textClass}`}>
                {item.status}
              </Text>
            </View>
          </View>

          {/* Date */}
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
            <Text className="text-xs text-gray-500">
              {formatDate(item.startDateTime)}
            </Text>
          </View>

          {/* Location */}
          {item.location && item.location !== "TBD" ? (
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name="location-outline" size={13} color="#9CA3AF" />
              <Text className="text-xs text-gray-500">{item.location}</Text>
            </View>
          ) : null}

          {/* Footer: theme + budget */}
          <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
            {item.theme ? (
              <Text className="text-xs text-gray-400">
                Theme: <Text className="text-gray-600">{item.theme}</Text>
              </Text>
            ) : (
              <View />
            )}
            <Text className="text-sm font-semibold text-pink-500">
              ₹{item.budget.toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name="layers-outline" size={40} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-semibold text-gray-900 mb-2">
        No Sub-Events Yet
      </Text>
      <Text className="text-sm text-gray-500 text-center px-8">
        Create your first sub-event to get started
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : !subEvents || subEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={subEvents}
          renderItem={renderSubEventCard}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="px-4 pb-24 pt-2"
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname:
              "/(protected)/(client-stack)/events/[eventId]/(organizer)/subevent-create",
            params: { eventId: eventId as string },
          });
        }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-pink-500 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
