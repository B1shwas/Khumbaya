import FamilyCard from "@/src/components/guest/FamilyGuestCard";
import GuestCard from "@/src/components/guest/GuestCard";
import { Text } from "@/src/components/ui/Text";
import { useGetInvitationsForEvent } from "@/src/features/guests/api/use-guests";
import {
  useFamilyGuestStore,
  useGuestDetailStore,
} from "@/src/features/guests/store/useGuestDetailStore";
import {
  FamilyGroup,
  GroupedInvitation,
  groupInvitationsByFamily,
} from "@/src/features/guests/types";
import { cn } from "@/src/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const setFamilyGuest = useFamilyGuestStore((state) => state.setFamilyGroup);
  const clearFamilyGuest = useFamilyGuestStore(
    (state) => state.clearFamilyGroup
  );
  const { data: invitations, isLoading } = useGetInvitationsForEvent(eventId);

  console.log("🙏🏻🙏🏻🙏🏻🙏🏻🙏🏻🙏🏻🙏🏻🙏🏻🙏🏻", invitations);

  const [activeTab, setActiveTab] = useState<GuestFilterTab>("all");

  const openAddGuestScreen = useCallback(() => {
    if (!eventId) return;
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/addguest`
    );
  }, [eventId, router]);

  const onPressGuestCard = (guest: any) => {
    setGuestDetail(guest);
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/guests/${guest.id}/guest-details` as any,
      params: { guest: JSON.stringify(guest) },
    });
  };
  const onPressFamilyCard = (FamilyData: FamilyGroup) => {
    setFamilyGuest(FamilyData);
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/guests/familymember` as any,
      params: { family: JSON.stringify(FamilyData) },
    });
  };
  const tabs: { label: string; value: GuestFilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Accepted", value: "accepted" },
    { label: "Pending", value: "pending" },
  ];

  // Group invitations by family
  const groupedInvitations = useMemo(() => {
    if (!invitations) return [];
    return groupInvitationsByFamily(invitations);
  }, [invitations]);

  // Filter grouped invitations based on active tab
  const filteredGroupedInvitations = useMemo(() => {
    return groupedInvitations.filter((item: GroupedInvitation) => {
      if (item.type === "family") {
        // For families, check if all members match the filter or any member matches
        const statuses = item.members.map((m) =>
          String(m.event_guest.status ?? "pending")
            .trim()
            .toLowerCase()
        );

        switch (activeTab) {
          case "pending":
            return statuses.some((s) => s === "pending" || s === "invited");
          case "accepted":
            return statuses.some((s) => s === "accepted");
          case "all":
          default:
            return true;
        }
      } else {
        const status = String(item.data.event_guest.status ?? "pending")
          .trim()
          .toLowerCase();

        switch (activeTab) {
          case "pending":
            return status === "pending" || status === "invited";
          case "accepted":
            return status === "accepted";
          case "all":
          default:
            return true;
        }
      }
    });
  }, [groupedInvitations, activeTab]);

  useEffect(() => {
    return () => {
      clearFamilyGuest();
      clearGuestDetail();
    };
  }, []);
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
        className="absolute right-6 bottom-12 w-14 h-14 rounded-full bg-[#EE2B8C] items-center justify-center z-50"
        style={{
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
          data={filteredGroupedInvitations}
          keyExtractor={(item: GroupedInvitation) => {
            if (item.type === "family") {
              return `family-${item.familyId}`;
            } else {
              return `individual-${item.data.user_detail.id}`;
            }
          }}
          renderItem={({ item }: { item: GroupedInvitation }) => {
            if (item.type === "family") {
              return (
                <FamilyCard
                  family={item}
                  onPress={() => {
                    onPressFamilyCard(item);
                  }}
                />
              );
            } else {
              return (
                <GuestCard
                  guest={item.data}
                  onPress={() => {
                    console.log("🚀🚀✅🚀🚀✅🚀🚀✅", item.data);
                    onPressGuestCard(item.data);
                  }}
                />
              );
            }
          }}
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
