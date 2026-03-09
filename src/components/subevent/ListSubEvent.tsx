import { useSubEvents } from "@/src/hooks/useSubEvents";
import { cn } from "@/src/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SubEventTab = "all" | "upcoming" | "completed";

export default function ListSubEvent() {
  const [activeTab, setActiveTab] = useState<SubEventTab>("all");
  const [mounted, setMounted] = useState(false);
  const { subEvents, loading, refreshing, refresh } = useSubEvents();

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();

  const tabs: { label: string; value: SubEventTab }[] = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "completed", value: "completed" },
  ];

  const getFilteredSubEvents = () => {
    const now = new Date();
    switch (activeTab) {
      case "upcoming":
        return subEvents.filter((se) => new Date(se.date) >= now);
      case "completed":
        return subEvents.filter((se) => new Date(se.date) < now);
      default:
        return subEvents;
    }
  };

  const filteredSubEvents = getFilteredSubEvents();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const renderSubEventCard = ({ item }: { item: (typeof subEvents)[0] }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm"
      onPress={() => {
        // Navigate to sub-event details if needed
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-pink-100 items-center justify-center mr-3">
            <Ionicons
              name={(item.template.icon as any) || "layers-outline"}
              size={24}
              color="#ee2b8c"
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {item.template.name}
            </Text>
            <Text className="text-sm text-gray-500">
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-gray-600">
            ${item.budget}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>
      {item.theme && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            Theme: <Text className="text-gray-700">{item.theme}</Text>
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

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

  if (!mounted) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-gray-200 items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Sub Events</Text>
        </View>
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
      <View className="flex-row p-1 mb-4 gap-2 bg-background-tertiary !rounded-md mx-4">
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

      {/* Sub Event List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : filteredSubEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredSubEvents}
          renderItem={renderSubEventCard}
          keyExtractor={(item) => item.template.id}
          contentContainerClassName="px-4 pb-24"
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={refreshing}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => {
          router.push(
            "/(protected)/(client-stack)/events/[eventId]/(subevent)/subevent-create"
          );
        }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-pink-500 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
