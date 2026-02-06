import { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type RelativePathString } from "expo-router";

type EventStatus = "Planning" | "Confirmed" | "Completed";
type EventTab = "myEvents" | "invited";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  status: EventStatus;
  isPast: boolean;
  isMyEvent: boolean; // true = My Events, false = Invited
}

const eventsData: Event[] = [
  {
    id: "1",
    title: "Sarah & Mike's Wedding",
    date: "Oct 24, 2023",
    time: "5:00 PM",
    location: "Grand Plaza Hotel",
    venue: "San Francisco, CA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMGBAVSA0a2mbV1NAsUQzu2bct2K06QsiZ1jLIpIf7nbUcD0SDuTMc-z75hROFlu_LFYS6GfeT0IqRnm7AbLiKsfERuzOvTIpNCDlKtTOcXYihWGijl5lpv6FUuJYne95hB_oQ_nxA-dIl28E1klx3juyud1wdRFijk9m43KdAbhRH-Lce5awx3x0UgGnkiFS7pGORCgl84OWwOA9D5zVEiQmLn-qp6adJQhSWlzYgKW5GpmgN2XlVRKLIC5jv2n1SqnX__0gkXGo",
    status: "Planning",
    isPast: false,
    isMyEvent: true,
  },
  {
    id: "2",
    title: "Diwali Celebration",
    date: "Nov 12, 2023",
    time: "7:00 PM",
    location: "Community Center",
    venue: "San Francisco, CA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoqHk60jIeSNZ9ki1c8iJtQhNgAylhPNie7B-e6RbVhqxqPZYWqYOStnWl2heFJMQW4km9uazp2AJ27FMETIhQQO3tXxYSIvbPNLiMuyf2dg0b3qT3v_GGw5YsO8M3pcj5Bnk0kNmcSQKT1p6x0bsxOFgm0JL10HY5_xet3NtTFkdXUpZlZid6xWZ7LqikDKmn0bLoVzit5hQKLe7VmvXCaa50hemlczbPWpDQbXcqd7R368vilNmPfa2ysrPk64t5Wga7Wgb-EVU",
    status: "Confirmed",
    isPast: false,
    isMyEvent: true,
  },
  {
    id: "3",
    title: "Annual Gala Dinner",
    date: "Dec 15, 2022",
    time: "6:30 PM",
    location: "City Convention Hall",
    venue: "San Francisco, CA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuApbhlzAVy4OJVcYMZ4izXUlnKPSNe70nYIazGktsGplBpkgzEzpvxp_qgIiF3dn8QLXQ1ADctibRDxZ_8gdSpJtPeEoAzmBa0mHWTHfuzG_-R1aDiqm_BFUf7Q3xk-cIN9jnmVd3yZIPYwSMQ_Mu4phO1tDt1Z-TSTdGCpvwYmq3-Q9FRAq6bw6rkqiEBN4F029JIYHOxmHinCw-RP9-524nQVGQFR9CRcag0PgTHdiwqETf0l_HGG1IVwJVdDlPIb-Lqrd3JnXWk",
    status: "Completed",
    isPast: true,
    isMyEvent: true,
  },
  {
    id: "4",
    title: "Summer Music Fest",
    date: "Jul 10, 2022",
    time: "2:00 PM",
    location: "Riverside Park",
    venue: "San Francisco, CA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuARGMTc7YD75O5-P1JXaqRK-kzu8vG4dIq7cAWSf3T_MtObQL1wDay2EjrgmOhEisjwDrxbgUi5CmmuPeBpNY8oTzyqjiQYIfhoMuhQ4alM838I-CHqYkWS_cPTJX3q8wMUv09PvLSFpA12g4XHRnHkHjl2GhsUzvy9UqCcZCecd_vx_3teq2dxTkkxf581tF1IXSMceXsU8alw80NOAhNnnzmeKmprOew-lXzEx3_2-LLgMplSZ80ITS0ryusXkdprVSAYOc0Y5Mc",
    status: "Completed",
    isPast: true,
    isMyEvent: false,
  },
  {
    id: "5",
    title: "Friend's Birthday Bash",
    date: "Mar 15, 2024",
    time: "8:00 PM",
    location: "Rooftop Lounge",
    venue: "San Francisco, CA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM",
    status: "Confirmed",
    isPast: false,
    isMyEvent: false,
  },
];

const getStatusColor = (status: EventStatus, isPast: boolean) => {
  if (isPast) {
    return "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  }
  switch (status) {
    case "Planning":
      return "bg-primary/10 text-primary border-primary/20";
    case "Confirmed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getDateColor = (isPast: boolean) => {
  return isPast ? "text-gray-400 dark:text-gray-500" : "text-primary dark:text-pink-300";
};

const EventCard = ({ event }: { event: Event }) => (
  <TouchableOpacity
    className="relative flex-row gap-3 bg-white p-3 rounded-xl mb-3 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform overflow-hidden"
    onPress={() => router.push(`/events/${event.id}` as RelativePathString)}
    activeOpacity={0.8}
  >
    <View className="shrink-0">
      <View
        className={`h-20 w-20 rounded-lg bg-cover bg-center ${event.isPast ? "grayscale-[0.5]" : ""}`}
        style={{ backgroundImage: `url("${event.imageUrl}")` }}
      />
    </View>
    <View className="flex-1 flex-col justify-between py-0.5">
      <View className="flex flex-row justify-between items-start gap-2">
        <Text className="text-gray-900 text-base font-bold leading-tight flex-1" numberOfLines={2}>
          {event.title}
        </Text>
        <View className={`shrink-0 px-2 py-0.5 rounded-full border ${getStatusColor(event.status, event.isPast)}`}>
          <Text className="text-[10px] font-bold uppercase tracking-wide">
            {event.status}
          </Text>
        </View>
      </View>
      <View>
        <View className="flex-row items-center gap-1.5 mb-1">
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text className="text-xs font-medium text-gray-500" numberOfLines={1}>{event.location}</Text>
        </View>
        <View className={`flex-row items-center gap-1.5 ${getDateColor(event.isPast)}`}>
          <Ionicons name="calendar" size={14} color={event.isPast ? "#9CA3AF" : "#ee2b8c"} />
          <Text className="text-xs font-semibold">{event.date} • {event.time}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("myEvents");
  const [refreshing, setRefreshing] = useState(false);

  const filteredEvents = eventsData.filter((e) => e.isMyEvent === (activeTab === "myEvents"));
  const upcomingEvents = filteredEvents.filter((e) => !e.isPast);
  const pastEvents = filteredEvents.filter((e) => e.isPast);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light overflow-hidden">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-xl font-bold">
            Your Events
          </Text>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
            onPress={() => router.push("/settings" as RelativePathString)}
          >
            <Ionicons name="settings" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="mt-4 pb-1">
          <View className="flex w-full bg-gray-100 p-1 rounded-xl flex-row">
            <TouchableOpacity
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${activeTab === "myEvents" ? "bg-white shadow-sm" : "bg-transparent"}`}
              onPress={() => setActiveTab("myEvents")}
            >
              <Text className={`text-sm font-bold text-center ${activeTab === "myEvents" ? "text-primary" : "text-gray-500"}`}>
                My Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${activeTab === "invited" ? "bg-white shadow-sm" : "bg-transparent"}`}
              onPress={() => setActiveTab("invited")}
            >
              <Text className={`text-sm font-bold text-center ${activeTab === "invited" ? "text-primary" : "text-gray-500"}`}>
                Invited
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content List */}
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View className="mb-2 mt-4">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Upcoming</Text>
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <View className="mb-4">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Past Events</Text>
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text className="font-bold text-lg text-gray-500 mt-4">No events found</Text>
            <Text className="text-sm text-gray-400 mt-1">
              {activeTab === "myEvents" ? "Create your first event to get started" : "No pending invitations"}
            </Text>
          </View>
        )}

        {/* Bottom spacer */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 z-30 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 active:scale-95"
        onPress={() => router.push("/create-event" as RelativePathString)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
