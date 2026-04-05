import FamilyCard from "@/src/components/guest/FamilyGuestCard";
import GuestCard from "@/src/components/guest/GuestCard";
import DraftInvitationCard from "@/src/components/guest/DraftInvitationCard";
import { Text } from "@/src/components/ui/Text";
import { useSubmitRsvpResponse } from "@/src/features/events/hooks/use-event";
import {
  useGetInvitationsForEvent,
  useRemoveInvitation,
} from "@/src/features/guests/api/use-guests";
import {
  useFamilyGuestStore,
  useGuestDetailStore,
} from "@/src/features/guests/store/useGuestDetailStore";
import {
  FamilyGroup,
  GroupedInvitation,
  groupInvitationsByFamily,
  GuestDetailInterface,
} from "@/src/features/guests/types";
import { cn } from "@/src/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
type GuestFilterTab = "accepted" | "pending" | "draft";

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
  const submitRsvpMutation = useSubmitRsvpResponse(eventId ?? 0);
  const removeInvitationMutation = useRemoveInvitation();
  const [draftAction, setDraftAction] = useState<{
    userId: number;
    type: "send" | "delete";
  } | null>(null);

  const [activeTab, setActiveTab] = useState<GuestFilterTab>("pending");

  const openAddGuestScreen = useCallback(() => {
    if (!eventId) return;
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/addguest`
    );
  }, [eventId, router]);

  const openContactPickerScreen = useCallback(() => {
    if (!eventId) return;
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/contactpicker`
    );
  }, [eventId, router]);

  const onPressGuestCard = (guest: GuestDetailInterface) => {
    setGuestDetail(guest);
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/guests/${guest.user_detail.id}/guest-details` as any,
      params: { guest: JSON.stringify(guest) },
    });
  };

  const onPressDraftSend = useCallback(
    async (guest: GuestDetailInterface) => {
      if (!eventId || !guest?.user_detail?.id) return;

      setDraftAction({ userId: guest.user_detail.id, type: "send" });
      try {
        await submitRsvpMutation.mutateAsync({
          userId: guest.user_detail.id,
          familyId: guest.event_guest.familyId,
          status: "pending",
        });
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to move draft to pending.";
        Alert.alert("Error", message);
      } finally {
        setDraftAction(null);
      }
    },
    [eventId, submitRsvpMutation]
  );

  const onDeleteDraft = useCallback(
    (guest: GuestDetailInterface) => {
      if (!eventId || !guest?.user_detail?.id) return;

      const displayName =
        guest.user_detail.username?.trim() ||
        guest.user_detail.email ||
        "this guest";

      Alert.alert(
        "Delete draft",
        `Delete ${displayName}'s draft invitation?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setDraftAction({ userId: guest.user_detail.id, type: "delete" });
              try {
                await removeInvitationMutation.mutateAsync({
                  eventId,
                  guestId: guest.user_detail.id,
                });
              } catch (error: any) {
                const message =
                  error?.response?.data?.message ||
                  error?.message ||
                  "Failed to delete draft invitation.";
                Alert.alert("Error", message);
              } finally {
                setDraftAction(null);
              }
            },
          },
        ]
      );
    },
    [eventId, removeInvitationMutation]
  );


  const onPressFamilyCard = (FamilyData: FamilyGroup) => {
    setFamilyGuest(FamilyData);
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/guests/familymember` as any,
      params: { family: JSON.stringify(FamilyData) },
    });
  };
  const tabs: { label: string; value: GuestFilterTab }[] = [
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Draft", value: "draft" }
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
          case "draft":

            return statuses.some((s) => s === "draft");
          default:
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
          case "draft":
          default:
            return status === "draft";
        }
      }
    });
  }, [groupedInvitations, activeTab]);

  const draftInvitations = useMemo(() => {
    if (!invitations) return [];

    return invitations.filter((invitation: GuestDetailInterface) => {
      const status = String(invitation.event_guest.status ?? "pending")
        .trim()
        .toLowerCase();
      return status === "draft";
    });
  }, [invitations]);

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

      {/* Import from contacts FAB */}
      <TouchableOpacity
        className="absolute right-6 bottom-32 w-14 h-14 rounded-full bg-white border border-[#EE2B8C] items-center justify-center z-50"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={openContactPickerScreen}
      >
        <Ionicons name="people-outline" size={24} color="#EE2B8C" />
      </TouchableOpacity>

      {/* Add guest manually FAB */}
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
      ) : activeTab === "draft" ? (
        <FlatList
          data={draftInvitations}
          keyExtractor={(item: GuestDetailInterface) =>
            `draft-${item.user_detail.id}`
          }
          renderItem={({ item }: { item: GuestDetailInterface }) => (
            <DraftInvitationCard
              guest={item}
              onMoveToPending={() => onPressDraftSend(item)}
              onDeleteDraft={() => onDeleteDraft(item)}
              isMoving={
                draftAction?.type === "send" &&
                draftAction?.userId === item.user_detail.id
              }
              isDeleting={
                draftAction?.type === "delete" &&
                draftAction?.userId === item.user_detail.id
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          className="mt-4"
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}
            >
              {invitations?.length
                ? "No draft invitations found."
                : "No guests yet."}
            </Text>
          }
        />
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
                ? `No ${activeTab} guests found.`
                : "No guests yet."}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
