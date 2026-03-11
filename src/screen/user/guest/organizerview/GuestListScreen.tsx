import { Text } from "@/src/components/ui/Text";
import { cn } from "@/src/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import GuestCard from "../../../../components/guest/GuestCard";
import { useGetInvitationsForEvent } from "../../../../features/guests/api/use-guests";
import { useGuestDetailStore } from "../../../../features/guests/store/useGuestDetailStore";
type GuestFilterTab = "all" | "accepted" | "pending";

export default function GuestListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId)
      ? params.eventId[0]
      : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const setGuestDetail = useGuestDetailStore((state) => state.setGuestDetail);
  const clearGuestDetail = useGuestDetailStore(
    (state) => state.clearGuestDetail
  );

const { data: invitations, isLoading } = useGetInvitationsForEvent(eventId);
  const [activeTab, setActiveTab] = useState<GuestFilterTab>("all");

  const openAddGuestScreen = useCallback(() => {
    if (!eventId) return;
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/addguest`
    );
  }, [eventId, router]);
  const onPress = (guest: any) => {
    setGuestDetail(guest);
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/guests/${guest.id}/guest-details` as any,
      params: { guest: JSON.stringify(guest) },
    });
  };
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

  useEffect(() => {
    return () => {
      clearGuestDetail();
    };
  }, [clearGuestDetail]);
  return (
    <SafeAreaView className="p-4  h-full" edges={[]}>
      <View className="px-4">
        <View className="h-14 my-2 rounded-md ">
          <TextInput
            className="flex-1 h-full px-6 text-base text-gray-900 bg-gray-300/50 rounded-md"
            placeholder="Search for the friend"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <View className="flex-row">
          {tabs.map((tab) => (
            <Pressable
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              className={cn(
                "flex-1 items-center pb-3 pt-2 border-b-2",
                activeTab === tab.value
                  ? "border-primary"
                  : "border-transparent"
              )}
            >
              <Text
                variant="h2"
                className={cn(
                  "uppercase tracking-wider",
                  activeTab === tab.value ? "text-primary" : "text-slate-500 "
                )}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 50,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#EE2B8C",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          shadowColor: "#EE2B8C",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={openAddGuestScreen}
      >
        <Ionicons name="add-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {isLoading ? (
        <Text>Loading invitations...</Text>
      ) : (
        <FlatList
          data={filteredInvitations}
          keyExtractor={(item: any, index: number) =>
            item?.user?.id ? String(item.user.id) : `guest-${index}`
          }
          renderItem={({ item }: { item: any }) => (
            <GuestCard guest={item} onPress={() => onPress(item)} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          className="mt-4"
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}
            >
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
