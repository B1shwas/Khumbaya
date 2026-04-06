import { useGetGuestRoom } from "@/src/features/guests/api/use-guests";
import { User } from "@/src/store/AuthStore";
import { shadowStyle } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Hotel_responce {
  user_detail: User | null;
  user_room: string | null;
}

type GuestSection = {
  title: string;
  data: Hotel_responce[];
};

type GroupByOption = "all" | "location" | "category";

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

function GuestRowItem({ guest }: { guest: Hotel_responce }) {
  const username = guest.user_detail?.username || "Unknown Guest";
  const room = guest.user_room?.trim();

  return (
    <View className="flex-row items-start  rounded-md px-3.5 py-3  bg-white "
    
    style={shadowStyle}
    >
      <View className="w-11 h-11 rounded-full bg-pink-100  items-center justify-center mr-3">
        <Text className="font-jakarta-bold text-[13px]  text-primary">
          {getInitials(username)}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="font-jakarta-semibold text-sm text-[#181114]">
          {username}
        </Text>

      <View className="flex-row items-center justify-between gap-1 mt-0.5">
        <View className="flex-row items-center gap-1 mt-1">
          {room ? (
            <>
              <Ionicons name="bed-outline" size={13} color="#9CA3AF" />
              <Text className="font-jakarta text-xs text-gray-500">Assigned room</Text>
            </>
          ) : (
            <>
              <Ionicons name="alert-circle-outline" size={13} color="#D1D5DB" />
              <Text className="font-jakarta text-xs text-gray-400 italic">
                Room not assigned
              </Text>
            </>
          )}
        </View>
      </View>

      
      </View>
            <View >
        {!!room && (
          <View className="mt-1.5 bg-blue-50 rounded-md px-2.5 py-1.5 self-start max-w-full">
            <Text className="font-jakarta-semibold text-[12px] text-blue-700">
              {room}
            </Text>
          </View>
        )}
        </View>
    </View>
  );
}

export default function HotelManagementScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const numericEventId = eventId ? Number(eventId) : null;

  const [searchText, setSearchText] = useState("");
  const [groupBy, setGroupBy] = useState<GroupByOption>("all");
  const [selectedGroupValue, setSelectedGroupValue] = useState("All");
  const [isGroupByModalVisible, setIsGroupByModalVisible] = useState(false);

  const {
    data: guestRooms = [],
    isLoading,
    isRefetching,
    refetch,
  } = useGetGuestRoom(numericEventId);

  const normalizedGuests = useMemo(() => {
    return Array.isArray(guestRooms)
      ? (guestRooms.filter(Boolean) as Hotel_responce[])
      : [];
  }, [guestRooms]);

  const filteredGuests = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return normalizedGuests;

    return normalizedGuests.filter((guest) => {
      const username = guest.user_detail?.username?.toLowerCase() ?? "";
      const phone = guest.user_detail?.phone?.toLowerCase() ?? "";
      const room = guest.user_room?.toLowerCase() ?? "";
      return (
        username.includes(query) ||
        phone.includes(query) ||
        room.includes(query)
      );
    });
  }, [normalizedGuests, searchText]);

  const getGroupValue = (guest: Hotel_responce) => {
    if (groupBy === "location") {
      return guest.user_detail?.location?.trim() || "Unknown location";
    }
    if (groupBy === "category") {
      return guest.user_detail?.relation?.trim() || "Uncategorized";
    }
    return "All";
  };

  const groupedValueStats = useMemo(() => {
    if (groupBy === "all") return [] as Array<{ label: string; count: number }>;

    const statsMap = new Map<string, number>();
    for (const guest of filteredGuests) {
      const value = getGroupValue(guest);
      statsMap.set(value, (statsMap.get(value) ?? 0) + 1);
    }

    return Array.from(statsMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredGuests, groupBy]);

  useEffect(() => {
    setSelectedGroupValue("All");
  }, [groupBy]);

  useEffect(() => {
    if (groupBy === "all") return;
    const hasSelected = groupedValueStats.some((v) => v.label === selectedGroupValue);
    if (selectedGroupValue !== "All" && !hasSelected) {
      setSelectedGroupValue("All");
    }
  }, [groupBy, groupedValueStats, selectedGroupValue]);

  const guestsAfterGroupPill = useMemo(() => {
    if (groupBy === "all" || selectedGroupValue === "All") return filteredGuests;
    return filteredGuests.filter((guest) => getGroupValue(guest) === selectedGroupValue);
  }, [filteredGuests, groupBy, selectedGroupValue]);

  const assignedGuests = guestsAfterGroupPill.filter((g) => !!g.user_room);
  const unassignedGuests = guestsAfterGroupPill.filter((g) => !g.user_room);

  const sections: GuestSection[] = [
    { title: "Assigned Rooms", data: assignedGuests },
    { title: "Not Assigned", data: unassignedGuests },
  ].filter((section) => section.data.length > 0);

  const totalGuests = normalizedGuests.length;
  const totalAssigned = normalizedGuests.filter((g) => !!g.user_room).length;
  const groupByIcon =
    groupBy === "all"
      ? "apps-outline"
      : groupBy === "location"
      ? "location-outline"
      : "grid-outline";
  const totalRooms = new Set(
    normalizedGuests
      .map((g) => g.user_room?.trim())
      .filter((room): room is string => !!room)
  ).size;

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
            onPress={() => setIsGroupByModalVisible(true)}
            className="h-12 w-12 bg-white border border-gray-200 rounded-md items-center justify-center"
          >
            <View className="items-center">
              <Ionicons name={groupByIcon} size={18} color="#374151" />
              <View className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-md bg-primary" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row bg-white mx-4 mb-3 mt-2 rounded-md py-3.5 shadow-sm">
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">{totalRooms}</Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">Rooms</Text>
        </View>
        <View className="w-px bg-gray-200 my-1" />
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">{totalGuests}</Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">Guests</Text>
        </View>
        <View className="w-px bg-gray-200 my-1" />
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">{totalAssigned}</Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">Assigned</Text>
        </View>
      </View>

      {groupBy !== "all" && groupedValueStats.length > 0 && (
        <View className="mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedGroupValue("All")}
              className={`px-3.5 py-2 rounded-md border ${
                selectedGroupValue === "All"
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`font-jakarta-semibold text-xs ${
                  selectedGroupValue === "All" ? "text-white" : "text-gray-700"
                }`}
              >
                All ({filteredGuests.length})
              </Text>
            </TouchableOpacity>

            {groupedValueStats.map((item) => {
              const isActive = selectedGroupValue === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => setSelectedGroupValue(item.label)}
                  className={`px-3.5 py-2 rounded-full border ${
                    isActive ? "bg-primary border-primary" : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-jakarta-semibold text-xs ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {item.label} ({item.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#ee2b8c" />
          <Text className="font-jakarta text-sm text-gray-400">
            Loading guest rooms...
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.user_detail?.id ?? "guest"}-${index}`}
          renderItem={({ item }) => <GuestRowItem guest={item} />}
          renderSectionHeader={({ section }) => (
            <View className="pt-1 pb-2">
              <Text className="font-jakarta-bold text-sm text-gray-700">
                {section.title} ({section.data.length})
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#ee2b8c"
              colors={["#ee2b8c"]}
            />
          }
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          ListEmptyComponent={
            <View className="items-center pt-16 gap-3">
              <Ionicons name="business-outline" size={48} color="#D1D5DB" />
              <Text className="font-jakarta text-sm text-gray-400">
                {normalizedGuests.length === 0
                  ? "No guests found for this event yet."
                  : "No matches found for your search."}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={isGroupByModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsGroupByModalVisible(false)}
      >
        <View className="flex-1 bg-black/35 justify-end">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsGroupByModalVisible(false)}
            className="absolute inset-0"
          />
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-7">
            <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-3" />
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-jakarta-bold text-base text-[#181114]">
                Organize list
              </Text>
              <TouchableOpacity onPress={() => setIsGroupByModalVisible(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setGroupBy("all");
                setIsGroupByModalVisible(false);
              }}
              className={`flex-row items-center justify-between px-4 py-3.5 rounded-md border mb-2 ${
                groupBy === "all"
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="apps-outline" size={16} color="#4B5563" />
                </View>
                <View>
                  <Text className="font-jakarta-semibold text-sm text-[#181114]">
                    All
                  </Text>
                  <Text className="font-jakarta text-[11px] text-gray-500">
                    Show all guests together
                  </Text>
                </View>
              </View>
              {groupBy === "all" && (
                <Ionicons name="checkmark-circle" size={18} color="#ee2b8c" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setGroupBy("location");
                setIsGroupByModalVisible(false);
              }}
              className={`flex-row items-center justify-between px-4 py-3.5 rounded-md border mb-2 ${
                groupBy === "location"
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="location-outline" size={16} color="#4B5563" />
                </View>
                <View>
                  <Text className="font-jakarta-semibold text-sm text-[#181114]">
                    Location
                  </Text>
                  <Text className="font-jakarta text-[11px] text-gray-500">
                    Group guests by place
                  </Text>
                </View>
              </View>
              {groupBy === "location" && (
                <Ionicons name="checkmark-circle" size={18} color="#ee2b8c" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setGroupBy("category");
                setIsGroupByModalVisible(false);
              }}
              className={`flex-row items-center justify-between px-4 py-3.5 rounded-md border ${
                groupBy === "category"
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="grid-outline" size={16} color="#4B5563" />
                </View>
                <View>
                  <Text className="font-jakarta-semibold text-sm text-[#181114]">
                    Category
                  </Text>
                  <Text className="font-jakarta text-[11px] text-gray-500">
                    Group guests by type
                  </Text>
                </View>
              </View>
              {groupBy === "category" && (
                <Ionicons name="checkmark-circle" size={18} color="#ee2b8c" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
