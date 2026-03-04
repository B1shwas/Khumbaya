import { cn } from "@/src/utils/cn";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetInvitationsForEvent } from "./api/use-guests";
import GuestCard from "./components/GuestCard";

type GuestFilterTab = "all" | "accepted" | "pending";


export default function GuestListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();


  const onPress = (guestId: number) => {
    router.push(`/(protected)/(client-stack)/events/${eventId}/(organizer)/guests/${guestId}/guest-details`);
  }
  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const { data: invitations, isLoading } = useGetInvitationsForEvent(eventId);

  const [activeTab, setActiveTab] = useState<GuestFilterTab>("all");
  const openAddGuestScreen = useCallback(() => {
    if (!eventId) return;
    router.push(`/(protected)/(client-stack)/events/${eventId}/(organizer)/addguest`);
  }, [eventId, router]);

  const tabs: { label: string; value: GuestFilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Accepted", value: "accepted" },
    { label: "Pending", value: "pending" },
  ];

  const filteredInvitations = useMemo(() => {
    if (!invitations) return [];

    return invitations.filter((invitation: any) => {
      const normalizedStatus = String(
        invitation?.status ?? invitation?.rsvp_status ?? ""
      )
        .trim()
        .toLowerCase();

      switch (activeTab) {
        case "pending":
          return normalizedStatus === "pending";
        case "accepted":
          return normalizedStatus === "accepted";
        case "all":
        default:
          return true;
      }
    });
  }, [invitations, activeTab]);


  return (
    <SafeAreaView className="p-4">
      <View className="sticky top-0 z-20 flex-row items-center justify-between px-4 py-3 bg-background-light/95  backdrop-blur-md">

        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-black/5 "
        >
          <MaterialIcons name="arrow-back" size={24} className="text-slate-900 dark:text-white" />
        </TouchableOpacity>

        {/* Center Title */}
        <View className="flex-col items-center">
          <Text className="text-lg font-bold leading-tight tracking-tight text-slate-900">
            Guest Management
          </Text>
          {/* <Text className="text-xs font-medium text-primary ">
          {invitations ? `${invitations.length} Guests` : "Loading..."}
        </Text> */}
        </View>

        {/* More Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10"
        >
          <MaterialIcons name="more-horiz" size={24} className="text-slate-900 dark:text-white" />
        </TouchableOpacity>

      </View>

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
      <View className="h-14 my-2 bg-white rounded-md ">
        <TextInput
          className="flex-1 h-full px-3 text-base text-gray-900 "
          placeholder="Search for the friend"
          placeholderTextColor="#9CA3AF"
        // value={searchQuery}
        // onChangeText={setSearchQuery}
        />
      </View>
      <TouchableOpacity
        style={{
          paddingVertical: 14,
          borderRadius: 12,
          backgroundColor: "#EE2B8C",
          alignItems: "center",
          marginBottom: 20,
        }}
        onPress={openAddGuestScreen}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>Add Guest</Text>
      </TouchableOpacity>

      {isLoading ? (
        <Text>Loading invitations...</Text>
      ) : (
        <FlatList
          data={filteredInvitations}
          keyExtractor={(item: any, index: number) =>
            item?.user?.id ? String(item.user.id) : `guest-${index}`
          }
          renderItem={({ item }: { item: any }) => <GuestCard guest={item} onPress={() => onPress(item.id)} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}>
              {invitations?.length
                ? `No ${activeTab === "all" ? "" : activeTab} guests found.`
                : "No guests invited yet."}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
