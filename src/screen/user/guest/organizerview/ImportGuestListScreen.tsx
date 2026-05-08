import { Text } from "@/src/components/ui/Text";
import { usegetUpcomingEvents } from "@/src/features/events/hooks/use-event";
import {
  useGetInvitationsForEvent,
  useInviteGuest,
} from "@/src/features/guests/api/use-guests";
import { GuestDetailInterface } from "@/src/features/guests/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ImportGuestListScreen() {
  const params = useLocalSearchParams();
  const targetEventId = Number(params.eventId);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<number>>(
    new Set()
  );
  const [isImporting, setIsImporting] = useState(false);

  const { data: events } = usegetUpcomingEvents();

  const { data: previewGuests, isLoading: previewLoading } =
    useGetInvitationsForEvent(selectedEventId);

  useEffect(() => {
    if (previewGuests && previewGuests.length > 0) {
      setSelectedGuestIds(
        new Set(previewGuests.map((g: GuestDetailInterface) => g.eventGuest.id))
      );
    } else {
      setSelectedGuestIds(new Set());
    }
  }, [previewGuests]);

  const inviteGuestMutation = useInviteGuest();

  const sourceEvents = useMemo(
    () =>
      (events ?? []).filter(
        (e: { id: string | number }) =>
          Number(e.id) !== targetEventId
      ),
    [events, targetEventId]
  );

  const toggleGuestSelection = (guestId: number) => {
    const newSet = new Set<number>(selectedGuestIds);

    if (newSet.has(guestId)) {
      newSet.delete(guestId);
    } else {
      newSet.add(guestId);
    }

    setSelectedGuestIds(newSet);
  };

  const runImport = async (asDraft: boolean) => {
    if (!selectedEventId || selectedGuestIds.size === 0) return;

    const count = selectedGuestIds.size;
    const label = asDraft ? "drafts" : "invitations";

    Alert.alert(
      "Import Guests",
      `Import ${count} guest${count === 1 ? "" : "s"} as ${label}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: async () => {
            try {
              setIsImporting(true);

              const selectedGuests = (previewGuests ?? []).filter(
                (g: GuestDetailInterface) =>
                  selectedGuestIds.has(g.eventGuest.id)
              );

              const results = await Promise.allSettled(
                selectedGuests.map((guest: GuestDetailInterface) =>
                  inviteGuestMutation.mutateAsync({
                    eventId: targetEventId,
                    payload: {
                      fullName:
                        guest.user.username || guest.user.email || "",
                      invitation_name:
                        guest.user.username || guest.user.email || "",
                      isDraft: asDraft,
                      phone: guest.user.phone || "",
                      isFamily: false,
                      role: guest.eventGuest.role || "Guest",
                      category: guest.eventGuest.category || "friend",
                      status: asDraft ? "draft" : "pending",
                      isAccomodation:
                        guest.eventGuest.isAccomodation ?? false,
                    },
                  })
                )
              );

              const successCount = results.filter(
                (r) => r.status === "fulfilled"
              ).length;

              setSelectedGuestIds(new Set());
              setSelectedEventId(null);

              Alert.alert(
                "Done",
                `${successCount} guest${successCount === 1 ? "" : "s"} imported as ${label}.`,
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to import guests. Please try again.");
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 px-4 pt-2" edges={[]}>
      {!selectedEventId ? (
        <>
          <Text className="text-slate-500 text-sm mb-3">
            Select an event to import guests from
          </Text>

          <FlatList
            data={sourceEvents}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedEventId(Number(item.id))}
                className="flex-row items-center p-4 mb-2 bg-white border border-slate-200 rounded-xl"
              >
                <View className="flex-1">
                  <Text className="font-jakarta-bold text-slate-900">
                    {item.title}
                  </Text>

                  {!!item.date && (
                    <Text className="text-sm text-slate-500">
                      {item.date}
                    </Text>
                  )}
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text className="text-center text-slate-400 mt-10">
                No other events found.
              </Text>
            }
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              setSelectedEventId(null);
              setSelectedGuestIds(new Set());
            }}
            className="flex-row items-center mb-3 gap-1"
          >
            <Ionicons name="arrow-back" size={18} color="#374151" />
            <Text className="text-slate-700 text-sm">
              Back to events
            </Text>
          </TouchableOpacity>

          {/* STATUS */}
          <Text className="text-slate-500 text-sm mb-3">
            {previewLoading
              ? "Loading guests..."
              : `${selectedGuestIds.size} of ${
                  previewGuests?.length ?? 0
                } guest${
                  (previewGuests?.length ?? 0) === 1 ? "" : "s"
                } selected`}
          </Text>

          {/* GUEST LIST */}
          <FlatList
            data={previewGuests ?? []}
            keyExtractor={(item: GuestDetailInterface) =>
              String(item.eventGuest.id)
            }
            renderItem={({ item }) => {
              const isSelected = selectedGuestIds.has(
                item.eventGuest.id
              );

              return (
                <TouchableOpacity
                  onPress={() =>
                    toggleGuestSelection(item.eventGuest.id)
                  }
                  className="flex-row items-center p-4 mb-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {/* CHECKBOX */}
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                      isSelected
                        ? "bg-[#EE2B8C] border-[#EE2B8C]"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <MaterialIcons
                        name="check"
                        size={14}
                        color="white"
                      />
                    )}
                  </View>

                  {/* AVATAR */}
                  <View className="size-10 rounded-full bg-slate-200 items-center justify-center mr-3">
                    <Ionicons
                      name="person"
                      size={18}
                      color="#64748b"
                    />
                  </View>

                  {/* INFO */}
                  <View className="flex-1">
                    <Text className="font-jakarta-bold text-slate-900">
                      {item.user.username || item.user.email}
                    </Text>

                    {!!item.eventGuest.category && (
                      <Text className="text-xs text-slate-500 capitalize">
                        {item.eventGuest.category}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 120 }}
          />

          {!previewLoading &&
            (previewGuests?.length ?? 0) > 0 &&
            selectedGuestIds.size > 0 && (
              <View className="absolute bottom-8 left-4 right-4 flex-row gap-3">
                <Pressable
                  onPress={() => runImport(false)}
                  disabled={isImporting}
                  className="flex-1 flex-row items-center justify-center rounded-xl border border-[#EE2B8C] bg-white py-4"
                  style={{ gap: 8 }}
                >
                  <Text className="text-base font-bold text-[#EE2B8C]">
                    {isImporting ? "Sending..." : "Send Invitation"}
                  </Text>
                  <MaterialIcons name="send" size={18} color="#EE2B8C" />
                </Pressable>

                <Pressable
                  onPress={() => runImport(true)}
                  disabled={isImporting}
                  className="flex-1 flex-row items-center justify-center rounded-xl bg-[#EE2B8C] py-4"
                  style={{ gap: 8 }}
                >
                  <Text className="text-base font-bold text-white">
                    {isImporting ? "Saving..." : "Save Draft"}
                  </Text>
                  <MaterialIcons name="drafts" size={18} color="white" />
                </Pressable>
              </View>
            )}
        </>
      )}
    </SafeAreaView>
  );
}