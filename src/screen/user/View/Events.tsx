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

type EventRole = "Vendor" | "Organizer" | "Guest";
type EventTab = "upcoming" | "requests" | "completed";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  role: EventRole;
  status: EventTab;
}

const eventsData: Event[] = [
  {
    id: "1",
    title: "Sarah & Mike's Wedding",
    date: "Oct 24, 2023",
    time: "5:00 PM",
    location: "Grand Plaza Hotel",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMGBAVSA0a2mbV1NAsUQzu2bct2K06QsiZ1jLIpIf7nbUcD0SDuTMc-z75hROFlu_LFYS6GfeT0IqRnm7AbLiKsfERuzOvTIpNCDlKtTOcXYihWGijl5lpv6FUuJYne95hB_oQ_nxA-dIl28E1klx3juyud1wdRFijk9m43KdAbhRH-Lce5awx3x0UgGnkiFS7pGORCgl84OWwOA9D5zVEiQmLn-qp6adJQhSWlzYgKW5GpmgN2XlVRKLIC5jv2n1SqnX__0gkXGo",
    role: "Organizer",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Diwali Celebration",
    date: "Nov 12, 2023",
    time: "7:00 PM",
    location: "Community Center",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoqHk60jIeSNZ9ki1c8iJtQhNgAylhPNie7B-e6RbVhqxqPZYWqYOStnWl2heFJMQW4km9uazp2AJ27FMETIhQQO3tXxYSIvbPNLiMuyf2dg0b3qT3v_GGw5YsO8M3pcj5Bnk0kNmcSQKT1p6x0bsxOFgm0JL10HY5_xet3NtTFkdXUpZlZid6xWZ7LqikDKmn0bLoVzit5hQKLe7VmvXCaa50hemlczbPWpDQbXcqd7R368vilNmPfa2ysrPk64t5Wga7Wgb-EVU",
    role: "Guest",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Annual Gala Dinner",
    date: "Dec 15, 2022",
    time: "6:30 PM",
    location: "City Convention Hall",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApbhlzAVy4OJVcYMZ4izXUlnKPSNe70nYIazGktsGplBpkgzEzpvxp_qgIiF3dn8QLXQ1ADctibRDxZ_8gdSpJtPeEoAzmBa0mHWTHfuzG_-R1aDiqm_BFUf7Q3xk-cIN9jnmVd3yZIPYwSMQ_Mu4phO1tDt1Z-TSTdGCpvwYmq3-Q9FRAq6bw6rkqiEBN4F029JIYHOxmHinCw-RP9-524nQVGQFR9CRcag0PgTHdiwqETf0l_HGG1IVwJVdDlPIb-Lqrd3JnXWk",
    role: "Vendor",
    status: "completed",
  },
  {
    id: "4",
    title: "Summer Music Fest",
    date: "Jul 10, 2022",
    time: "2:00 PM",
    location: "Riverside Park",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARGMTc7YD75O5-P1JXaqRK-kzu8vG4dIq7cAWSf3T_MtObQL1wDay2EjrgmOhEisjwDrxbgUi5CmmuPeBpNY8oTzyqjiQYIfhoMuhQ4alM838I-CHqYkWS_cPTJX3q8wMUv09PvLSFpA12g4XHRnHkHjl2GhsUzvy9UqCcZCecd_vx_3teq2dxTkkxf581tF1IXSMceXsU8alw80NOAhNnnzmeKmprOew-lXzEx3_2-LLgMplSZ80ITS0ryusXkdprVSAYOc0Y5Mc",
    role: "Organizer",
    status: "requests",
  },
];

// ✅ KEY FIX: Every class string must be a complete literal for NativeWind's
// Babel plugin to detect at build time. Never build class strings dynamically.
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
}: {
  event: Event;
  onPress: () => void;
}) => {
  const { wrapperClass, textClass } = roleConfig[event.role];

  return (
    <Pressable onPress={onPress} className="flex-row p-3">
      {/* Event Image */}
      <View className="w-20 h-20 rounded-lg overflow-hidden">
        <Image
          source={{ uri: event.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="p-4">
        {/* Title + Role Badge */}
        <View className="flex-row items-start justify-between mb-2">
          <Text
            className="text-gray-900 font-semibold text-base flex-1 mr-2"
            numberOfLines={1}
          >
            {event.title}
          </Text>
          <View className={wrapperClass}>
            <Text className={textClass}>{event.role}</Text>
          </View>
        </View>

        {/* Location */}
        <View className="flex-row items-center mb-1">
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">{event.location}</Text>
        </View>

        {/* Date & Time */}
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {event.date} • {event.time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const tabs: { label: string; value: EventTab }[] = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Requests", value: "requests" },
    { label: "Completed", value: "completed" },
  ];

  const filteredEvents = eventsData.filter((e) => e.status === activeTab);

  const emptyMessage: Record<EventTab, string> = {
    upcoming: "Create your first event to get started",
    requests: "No pending invitations",
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
      <View className="flex-row p-1 mb-4 gap-2 bg-gray-200 !rounded-md">
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 py-2 rounded-md items-center",
              activeTab === tab.value ? "bg-primary" : "text-gray-600",
            )}
          >
            <Text
              className={cn(
                "text-sm font-jakarta-semibold p-1",
                activeTab === tab.value ? "text-white" : "text-gray-500",
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
        className="absolute bottom-6 right-6 w-14 h-14 bg-purple-600 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
