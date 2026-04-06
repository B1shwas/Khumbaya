import { CompletedEventsTab } from "@/src/components/event/CompletedEvent";
import { InvitedEventsTab } from "@/src/components/event/InvitedEvent";
import { UpcomingEventsTab } from "@/src/components/event/UpcomingEvent";
import { EventTab } from "@/src/constants/event";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import { cn } from "@/src/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [mounted, setMounted] = useState(false);
  const { push } = useThrottledRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();

  const tabs: { label: string; value: EventTab }[] = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Invited", value: "invited" },
    { label: "Completed", value: "completed" },
  ];

  if (!mounted) return null;
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
      {activeTab === "upcoming" && (
        <View className="flex-1">
          <UpcomingEventsTab isActive={activeTab === "upcoming"} />
        </View>
      )}
      {activeTab === "invited" && (
        <View className="flex-1">
          <InvitedEventsTab isActive={activeTab === "invited"} />
        </View>
      )}
      {activeTab === "completed" && (
        <View className="flex-1">
          <CompletedEventsTab isActive={activeTab === "completed"} />
        </View>
      )}
      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => {
          push("/(protected)/(client-stack)/events/create");
        }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
