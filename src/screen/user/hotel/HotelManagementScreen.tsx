import { useSubmitRsvpResponse } from "@/src/features/events/hooks/use-event";
import { useGetGuestRoom } from "@/src/features/guests/api/use-guests";
import { shadowStyle } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Hotel_responce {
  user_detail: {
    id?: number;
    username?: string;
    phone?: string;
    familyId?: number;
  } | null;
  user_room: string | null;
  assigned_room?: string | null;
  category: string | null;
  invitationId: number;

  hasCheckedIn?: boolean | null;
  hasCheckedOut?: boolean | null;
}

type RoomCard = {
  room: string;
  guests: Hotel_responce[];
  status: "checked-in" | "checked-out" | "pending";
};

function getGuestStatus(
  guest: Hotel_responce
): "checked-in" | "checked-out" | "pending" {
  if (guest.hasCheckedOut) return "checked-out";
  if (guest.hasCheckedIn) return "checked-in";
  return "pending";
}

function getRoomStatus(
  guests: Hotel_responce[]
): "checked-in" | "checked-out" | "pending" {
  if (guests.some((guest) => getGuestStatus(guest) === "checked-out")) {
    return "checked-out";
  }
  if (guests.some((guest) => getGuestStatus(guest) === "checked-in")) {
    return "checked-in";
  }
  return "pending";
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

function getShortDisplayName(name: string, maxLength = 18): string {
  const normalized = name.trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1)}…`;
}

function getGuestRoomValue(guest: Hotel_responce): string {
  return guest.user_room?.trim() || guest.assigned_room?.trim() || "";
}

function RoomCardItem({
  item,
  isPending,
  onCheckIn,
}: {
  item: RoomCard;
  isPending: boolean;
  onCheckIn: (room: string) => void;
}) {
  return (
    <View
      className="bg-white rounded-md border border-gray-100 p-3.5 gap-3"
      style={shadowStyle}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-2">
          <View className="px-3 py-1 rounded-full bg-primary border border-primary/70">
            <Text className="font-jakarta-extrabold text-[12px] text-white tracking-wide uppercase">
              Room {item.room}
            </Text>
          </View>

          <View className="px-2.5 py-1 rounded-full bg-gray-100">
            <Text className="font-jakarta-bold text-[10px] text-gray-500">
              {item.guests.length} Guest{item.guests.length === 1 ? "" : "s"}
            </Text>
          </View>

          {item.status === "checked-in" && (
            <View className="px-2.5 py-1 rounded-full bg-green-100 border border-green-200">
              <Text className="font-jakarta-bold text-[10px] text-green-700">
                Checked In
              </Text>
            </View>
          )}

          {item.status === "checked-out" && (
            <View className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200">
              <Text className="font-jakarta-bold text-[10px] text-amber-700">
                Checked Out
              </Text>
            </View>
          )}
        </View>

        {item.status !== "checked-in" && (
          <TouchableOpacity
            disabled={isPending}
            onPress={() => onCheckIn(item.room)}
            className={`px-4 py-2 rounded-md ${isPending ? "bg-primary/60" : "bg-primary"}`}
          >
            <Text className="font-jakarta-bold text-[12px] text-white">
              Check In
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-col gap-2">
        {item.guests.slice(0, 4).map((guest, idx) => {
          const username = guest.user_detail?.username || `Guest ${idx + 1}`;
          const displayName = getShortDisplayName(username, 18);
          const phone = guest.user_detail?.phone
            ? guest.user_detail.phone
            : "Phone unavailable";
          const guestStatus = getGuestStatus(guest);

          return (
            <View
              key={`${guest.user_detail?.id ?? username}-${idx}`}
              className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-3"
            >
              <View className="flex-row items-start gap-3">
                <View className="w-10 h-10 rounded-full bg-pink-100 items-center justify-center">
                  <Text className="font-jakarta-bold text-[12px] text-primary">
                    {getInitials(username)}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="font-jakarta-semibold text-sm text-[#181114]">
                    {displayName}
                  </Text>
                  <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">
                    {phone}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {item.guests.length > 4 && (
          <View className="rounded-xl border border-dashed border-gray-200 bg-white px-3 py-2">
            <Text className="font-jakarta text-[11px] text-gray-500">
              +{item.guests.length - 4} more guest
              {item.guests.length - 4 === 1 ? "" : "s"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function UnassignedGuestRow({
  guest,
  onAssignRoom,
}: {
  guest: Hotel_responce;
  onAssignRoom: (guest: Hotel_responce) => void;
}) {
  const username = guest.user_detail?.username || "Unknown Guest";

  return (
    <TouchableOpacity
      onPress={() => onAssignRoom(guest)}
      className="flex-row items-center rounded-md px-3.5 py-3 bg-white border border-gray-100"
      style={shadowStyle}
    >
      <View className="bg-gray-100 rounded-md px-3 py-2 mr-3 min-w-12 border border-dashed border-gray-300 justify-center items-center">
        <Ionicons name="add" size={16} color="#9CA3AF" />
      </View>

      <View className="w-10 h-10 rounded-full bg-pink-100 items-center justify-center mr-3">
        <Text className="font-jakarta-bold text-[12px] text-primary">
          {getInitials(username)}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="font-jakarta-semibold text-sm text-[#181114]">
          {username}
        </Text>
        <Text className="font-jakarta text-xs text-gray-400 italic mt-1">
          Tap to assign room
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HotelManagementScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const numericEventId = eventId ? Number(eventId) : null;

  const { mutate: submitRsvpResponse, isPending } = useSubmitRsvpResponse(
    Number(eventId)
  );

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [roomCheckInModal, setRoomCheckInModal] = useState<{
    visible: boolean;
    room: string | null;
    guests: Hotel_responce[];
  }>({ visible: false, room: null, guests: [] });
  const [activeCheckinUserId, setActiveCheckinUserId] = useState<number | null>(
    null
  );
  const [roomAssignmentModal, setRoomAssignmentModal] = useState<{
    visible: boolean;
    guest: Hotel_responce | null;
  }>({ visible: false, guest: null });
  const [newRoom, setNewRoom] = useState("");

  const {
    data: guestRooms = [],
    isLoading,
    isRefetching,
    refetch,
  } = useGetGuestRoom(numericEventId);

  const normalizedGuests = useMemo(() => {
    return Array.isArray(guestRooms)
      ? (guestRooms.filter(Boolean) as Hotel_responce[]).map((guest) => ({
          ...guest,
          user_room: guest.user_room?.trim()
            ? guest.user_room.trim()
            : (guest.assigned_room?.trim() ?? null),
        }))
      : [];
  }, [guestRooms]);

  const getNormalizedCategory = (category?: string | null) => {
    return category?.trim().toLowerCase() || "uncategorized";
  };

  const formatCategoryLabel = (category: string) => {
    if (category === "vvip") return "VVIP";
    if (category === "uncategorized") return "Uncategorized";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const filteredGuests = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return normalizedGuests;

    return normalizedGuests.filter((guest) => {
      const username = guest.user_detail?.username?.toLowerCase() ?? "";
      const phone = guest.user_detail?.phone?.toLowerCase() ?? "";
      const room = getGuestRoomValue(guest).toLowerCase();
      return (
        username.includes(query) ||
        phone.includes(query) ||
        room.includes(query)
      );
    });
  }, [normalizedGuests, searchText]);

  const categoryStats = useMemo(() => {
    const categoryCountMap = new Map<string, number>();

    for (const guest of filteredGuests) {
      const category = getNormalizedCategory(guest.category);
      categoryCountMap.set(category, (categoryCountMap.get(category) ?? 0) + 1);
    }

    const preferredOrder = [
      "friend",
      "family",
      "colleague",
      "vvip",
      "uncategorized",
    ];

    return Array.from(categoryCountMap.entries())
      .map(([value, count]) => ({
        value,
        label: formatCategoryLabel(value),
        count,
      }))
      .sort((a, b) => {
        const ai = preferredOrder.indexOf(a.value);
        const bi = preferredOrder.indexOf(b.value);
        if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
  }, [filteredGuests]);

  useEffect(() => {
    if (selectedCategory === "all") return;
    const exists = categoryStats.some(
      (item) => item.value === selectedCategory
    );
    if (!exists) setSelectedCategory("all");
  }, [categoryStats, selectedCategory]);

  const guestsAfterCategoryFilter = useMemo(() => {
    if (selectedCategory === "all") return filteredGuests;
    return filteredGuests.filter(
      (guest) => getNormalizedCategory(guest.category) === selectedCategory
    );
  }, [filteredGuests, selectedCategory]);

  const roomCards = useMemo(() => {
    const guestsByRoom = new Map<string, Hotel_responce[]>();

    for (const guest of guestsAfterCategoryFilter) {
      const room = getGuestRoomValue(guest);
      if (!room) continue;

      if (!guestsByRoom.has(room)) {
        guestsByRoom.set(room, []);
      }
      guestsByRoom.get(room)!.push(guest);
    }

    const sortedRooms = Array.from(guestsByRoom.keys()).sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });

    return sortedRooms.map((room) => ({
      room,
      guests: guestsByRoom.get(room) ?? [],
      status: getRoomStatus(guestsByRoom.get(room) ?? []),
    }));
  }, [guestsAfterCategoryFilter]);

  const unassignedGuests = useMemo(
    () => guestsAfterCategoryFilter.filter((g) => !getGuestRoomValue(g)),
    [guestsAfterCategoryFilter]
  );

  const totalGuests = normalizedGuests.length;
  const totalAssigned = normalizedGuests.filter(
    (g) => !!getGuestRoomValue(g)
  ).length;
  const totalRooms = new Set(
    normalizedGuests
      .map((g) => getGuestRoomValue(g))
      .filter((room): room is string => !!room)
  ).size;

  const selectedCategoryLabel =
    selectedCategory === "all" ? "All" : formatCategoryLabel(selectedCategory);

  const categoryPickerOptions = [
    {
      value: "all",
      label: "All",
      count: filteredGuests.length,
    },
    ...categoryStats,
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={[]}>
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-white rounded-md px-3.5 h-12">
            <Ionicons
              name="search-outline"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-sm text-gray-900 font-jakarta"
              placeholder="Search by guest, phone, or room..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setIsCategoryModalVisible(true)}
            className="h-12 w-12 bg-white border border-gray-200 rounded-md items-center justify-center"
          >
            <View className="items-center">
              <Ionicons name="funnel-outline" size={18} color="#374151" />
              {selectedCategory !== "all" && (
                <View className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-[11px] text-gray-500 mt-2 font-jakarta">
          {selectedCategoryLabel} • {guestsAfterCategoryFilter.length} guest
          {guestsAfterCategoryFilter.length === 1 ? "" : "s"}
        </Text>
      </View>

      <View className="flex-row bg-white mx-4 mb-3 mt-2 rounded-md py-3.5 shadow-sm">
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">
            {totalRooms}
          </Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">
            Rooms
          </Text>
        </View>
        <View className="w-px bg-gray-200 my-1" />
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">
            {totalGuests}
          </Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">
            Guests
          </Text>
        </View>
        <View className="w-px bg-gray-200 my-1" />
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">
            {totalAssigned}
          </Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">
            Assigned
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#ee2b8c" />
          <Text className="font-jakarta text-sm text-gray-400">
            Loading guest rooms...
          </Text>
        </View>
      ) : (
        <FlatList
          data={roomCards}
          keyExtractor={(item) => item.room}
          renderItem={({ item }) => (
            <RoomCardItem
              item={item}
              isPending={isPending}
              onCheckIn={(room) => {
                const roomGuests = roomCards.find(
                  (roomCard) => roomCard.room === room
                )?.guests;

                if (!roomGuests?.length) return;

                setRoomCheckInModal({
                  visible: true,
                  room,
                  guests: roomGuests,
                });
              }}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            paddingTop: 4,
            gap: 10,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#ee2b8c"
              colors={["#ee2b8c"]}
            />
          }
          ListFooterComponent={
            unassignedGuests.length > 0 ? (
              <View className="mt-4 gap-2.5">
                <Text className="font-jakarta-bold text-sm text-gray-700">
                  Not Assigned ({unassignedGuests.length})
                </Text>

                {unassignedGuests.map((guest, idx) => (
                  <UnassignedGuestRow
                    key={`${guest.user_detail?.id ?? "guest"}-${idx}`}
                    guest={guest}
                    onAssignRoom={(selectedGuest) => {
                      setRoomAssignmentModal({
                        visible: true,
                        guest: selectedGuest,
                      });
                      setNewRoom("");
                    }}
                  />
                ))}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center pt-16 gap-3">
              <Ionicons name="business-outline" size={48} color="#D1D5DB" />
              <Text className="font-jakarta text-sm text-gray-400 text-center">
                {normalizedGuests.length === 0
                  ? "No guests found for this event yet."
                  : "No rooms or guest matches found for your search."}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={roomCheckInModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setRoomCheckInModal({ visible: false, room: null, guests: [] });
        }}
      >
        <View className="flex-1 bg-black/35 justify-end">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setRoomCheckInModal({ visible: false, room: null, guests: [] });
            }}
            className="absolute inset-0"
          />

          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-7 max-h-[78%]">
            <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-3" />
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="font-jakarta-bold text-base text-[#181114]">
                  Room Check In
                </Text>
                <Text className="font-jakarta text-xs text-gray-500 mt-1">
                  Room {roomCheckInModal.room || "-"} •{" "}
                  {roomCheckInModal.guests.length} guest
                  {roomCheckInModal.guests.length === 1 ? "" : "s"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setRoomCheckInModal({
                    visible: false,
                    room: null,
                    guests: [],
                  });
                }}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {roomCheckInModal.guests.length === 0 ? (
              <View className="items-center justify-center py-10">
                <Text className="font-jakarta text-sm text-gray-400">
                  No guests available in this room.
                </Text>
              </View>
            ) : (
              <FlatList
                data={roomCheckInModal.guests}
                keyExtractor={(guest, idx) =>
                  String(guest.invitationId ?? guest.user_detail?.id ?? idx)
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
                renderItem={({ item: guest, index }) => {
                  const username =
                    guest.user_detail?.username || `Guest ${index + 1}`;
                  const isCurrentGuestPending =
                    isPending && activeCheckinUserId === guest.user_detail?.id;
                  const guestStatus = getGuestStatus(guest);
                  const actionType =
                    guestStatus === "checked-in"
                      ? "check-out"
                      : guestStatus === "pending"
                        ? "check-in"
                        : "none";

                  return (
                    <View
                      className="bg-white border border-gray-100 rounded-xl px-3.5 py-3"
                      style={shadowStyle}
                    >
                      <View className="flex-row items-center justify-between gap-3">
                        <View className="flex-row items-center gap-2 flex-1">
                          <View className="w-10 h-10 rounded-full bg-pink-100 items-center justify-center">
                            <Text className="font-jakarta-bold text-[12px] text-primary">
                              {getInitials(username)}
                            </Text>
                          </View>

                          <View className="flex-1">
                            <Text
                              className="font-jakarta-semibold text-sm text-[#181114]"
                              numberOfLines={1}
                            >
                              {username}
                            </Text>
                            <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">
                              {guest.user_detail?.phone || "Phone unavailable"}
                            </Text>

                            <View className="flex-row items-center gap-2 mt-1">
                              {guestStatus === "checked-in" && (
                                <View className="px-2 py-0.5 rounded-full bg-green-100 border border-green-200">
                                  <Text className="font-jakarta-bold text-[9px] text-green-700">
                                    Checked In
                                  </Text>
                                </View>
                              )}
                              {guestStatus === "checked-out" && (
                                <View className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200">
                                  <Text className="font-jakarta-bold text-[9px] text-amber-700">
                                    Checked Out
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                        {getGuestRoomValue(guest) ? (
                          <View className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                            <Text className="font-jakarta text-xs text-primary mb-1">
                              Assigned room
                            </Text>
                            <View className="flex-row items-center justify-between">
                              <View className="flex-row items-center gap-2">
                                <Ionicons
                                  name="bed-outline"
                                  size={14}
                                  color="#ee2b8c"
                                />
                                <Text className="font-jakarta-bold text-sm text-primary">
                                  Room {getGuestRoomValue(guest)}
                                </Text>
                              </View>
                              <Text className="font-jakarta text-[11px] text-primary">
                                {guest.user_detail?.phone || "—"}
                              </Text>
                            </View>
                          </View>
                        ) : null}

                        {actionType === "none" ? (
                          <View className="px-3 py-2 rounded-md bg-amber-100 border border-amber-200">
                            <Text className="font-jakarta-bold text-[11px] text-amber-700">
                              Checked Out
                            </Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            disabled={
                              isCurrentGuestPending || !guest.user_detail?.id
                            }
                            onPress={() => {
                              if (!guest.user_detail?.id || !numericEventId)
                                return;

                              setActiveCheckinUserId(guest.user_detail.id);

                              submitRsvpResponse(
                                {
                                  userId: guest.user_detail.id,
                                  familyId: guest.user_detail.familyId
                                    ? guest.user_detail.familyId
                                    : undefined,
                                  hasCheckedIn: actionType === "check-in",
                                  hasCheckedOut: actionType === "check-out",
                                },
                                {
                                  onSuccess: () => {
                                    setRoomCheckInModal({
                                      visible: false,
                                      room: null,
                                      guests: [],
                                    });
                                    refetch();
                                  },
                                  onError: (error) => {
                                    console.error(
                                      "Status update failed:",
                                      error
                                    );
                                  },
                                  onSettled: () => {
                                    setActiveCheckinUserId(null);
                                  },
                                }
                              );
                            }}
                            className={`px-3.5 py-2 rounded-md ${
                              isCurrentGuestPending
                                ? "bg-primary/60"
                                : actionType === "check-out"
                                  ? "bg-amber-500"
                                  : "bg-primary"
                            }`}
                          >
                            {isCurrentGuestPending ? (
                              <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                              <Text className="font-jakarta-bold text-[12px] text-white">
                                {actionType === "check-out"
                                  ? "Check Out"
                                  : "Check In"}
                              </Text>
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View className="flex-1 bg-black/35 justify-end">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsCategoryModalVisible(false)}
            className="absolute inset-0"
          />
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-7">
            <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-3" />
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-jakarta-bold text-base text-[#181114]">
                Filter by category
              </Text>
              <TouchableOpacity
                onPress={() => setIsCategoryModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {categoryPickerOptions.map((option) => {
              const isActive = selectedCategory === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSelectedCategory(option.value);
                    setIsCategoryModalVisible(false);
                  }}
                  className={`flex-row items-center justify-between px-4 py-3.5 rounded-xl border mb-2 ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Text className="font-jakarta-semibold text-sm text-[#181114]">
                    {option.label}
                  </Text>

                  <View className="flex-row items-center gap-2">
                    <Text className="font-jakarta text-xs text-gray-500">
                      {option.count}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#ee2b8c"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      <Modal
        visible={roomAssignmentModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setRoomAssignmentModal({ visible: false, guest: null })
        }
      >
        <View className="flex-1 bg-black/35 justify-center px-4">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              setRoomAssignmentModal({ visible: false, guest: null })
            }
            className="absolute inset-0"
          />
          <View className="bg-white rounded-2xl px-5 py-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-jakarta-bold text-base text-[#181114]">
                Assign Room
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setRoomAssignmentModal({ visible: false, guest: null })
                }
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {roomAssignmentModal.guest && (
              <>
                <View className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                  <Text className="font-jakarta text-xs text-primary mb-2">
                    Assigned guest
                  </Text>
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                      <Text className="font-jakarta-bold text-base text-primary">
                        {getInitials(
                          roomAssignmentModal.guest.user_detail?.username || "G"
                        )}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-jakarta-semibold text-sm text-[#181114]">
                        {roomAssignmentModal.guest.user_detail?.username ||
                          "Unknown Guest"}
                      </Text>
                      <Text className="font-jakarta text-[11px] text-primary mt-0.5">
                        {roomAssignmentModal.guest.user_detail?.phone ||
                          "Phone unavailable"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="font-jakarta text-xs text-gray-500 mb-2">
                    Room Number
                  </Text>
                  <TextInput
                    className="border border-gray-200 rounded-lg px-4 py-3 font-jakarta text-sm text-[#181114]"
                    placeholder="e.g., 101, Suite A"
                    placeholderTextColor="#9CA3AF"
                    value={newRoom}
                    onChangeText={setNewRoom}
                  />
                </View>

                <View className="gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      const roomValue = newRoom.trim();
                      if (
                        roomValue &&
                        roomAssignmentModal.guest?.user_detail?.id
                      ) {
                        submitRsvpResponse({
                          assigned_room: roomValue,
                          userId: roomAssignmentModal.guest.user_detail.id,
                          familyId: roomAssignmentModal.guest.user_detail
                            .familyId
                            ? roomAssignmentModal.guest.user_detail.familyId
                            : undefined,
                        });
                        setRoomAssignmentModal({ visible: false, guest: null });
                        setNewRoom("");
                        refetch();
                      }
                    }}
                    className="bg-primary rounded-lg py-3 items-center"
                  >
                    <Text className="font-jakarta-semibold text-sm text-white">
                      Assign Room
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setRoomAssignmentModal({ visible: false, guest: null });
                      setNewRoom("");
                    }}
                    className="border border-gray-200 rounded-lg py-3 items-center"
                  >
                    <Text className="font-jakarta-semibold text-sm text-[#181114]">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
