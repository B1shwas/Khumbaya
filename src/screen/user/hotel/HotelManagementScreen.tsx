import { useGetHotelManagement } from "@/src/features/hotel/api/use-hotel";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GuestRow {
  guestId: number;
  guestName: string;
  roomNumber: string;
  phone: string;
}

interface HotelGroup {
  hotelId: string;
  hotelName: string;
  location: string;
  guests: GuestRow[];
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
}

function GuestRowItem({ guest }: { guest: GuestRow }) {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="w-[38px] h-[38px] rounded-full bg-pink-100 items-center justify-center mr-2.5">
        <Text className="font-jakarta-bold text-[13px] text-primary">
          {getInitials(guest.guestName)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="font-jakarta-semibold text-sm text-[#181114] mb-0.5">
          {guest.guestName}
        </Text>
        <View className="flex-row items-center gap-1">
          {guest.roomNumber ? (
            <>
              <Ionicons name="bed-outline" size={12} color="#9CA3AF" />
              <Text className="font-jakarta text-xs text-gray-500">
                Room {guest.roomNumber}
              </Text>
            </>
          ) : (
            <Text className="font-jakarta text-xs text-gray-300 italic">
              Room not assigned
            </Text>
          )}
        </View>
      </View>
      {guest.roomNumber ? (
        <View className="bg-blue-50 px-2.5 py-1 rounded-lg">
          <Text className="font-jakarta-bold text-xs text-blue-500">
            {guest.roomNumber}
          </Text>
        </View>
      ) : (
        <View className="bg-gray-100 px-2.5 py-1 rounded-lg">
          <Text className="font-jakarta-bold text-xs text-gray-400">—</Text>
        </View>
      )}
    </View>
  );
}

function HotelCard({ hotel }: { hotel: HotelGroup }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View className="w-12 h-12 rounded-xl bg-pink-100 items-center justify-center mr-3">
          <Ionicons name="business" size={22} color="#ee2b8c" />
        </View>
        <View className="flex-1">
          <Text className="font-jakarta-bold text-[15px] text-[#181114] mb-0.5">
            {hotel.hotelName}
          </Text>
          {hotel.location ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={12} color="#9CA3AF" />
              <Text className="font-jakarta text-xs text-gray-400">
                {hotel.location}
              </Text>
            </View>
          ) : null}
        </View>
        <View className="items-center bg-gray-50 px-3 py-1.5 rounded-xl">
          <Text className="font-jakarta-bold text-base text-[#181114]">
            {hotel.guests.length}
          </Text>
          <Text className="font-jakarta text-[10px] text-gray-500">guests</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#9CA3AF"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {expanded && <View className="h-px bg-gray-100 mx-4" />}

      {expanded && (
        <View className="px-4 pb-3 pt-1">
          {hotel.guests.map((guest, index) => (
            <View key={guest.guestId}>
              <GuestRowItem guest={guest} />
              {index < hotel.guests.length - 1 && (
                <View className="h-px bg-gray-100" />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function HotelManagementScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const numericEventId = eventId ? Number(eventId) : null;

  const [searchText, setSearchText] = useState("");

  const { data: hotelGuests = [], isLoading } = useGetHotelManagement(numericEventId);

  const hotelGroups: HotelGroup[] = useMemo(() => {
    if (!hotelGuests.length) return [];

    const ungrouped: GuestRow[] = hotelGuests
      .filter((g) => g?.user)
      .map((g) => ({
        guestId: g.user.id,
        guestName: g.user.username,
        roomNumber: g.assigned_room ?? "",
        phone: g.user.phone,
      }));

    const withRoom = ungrouped.filter((g) => g.roomNumber);
    const withoutRoom = ungrouped.filter((g) => !g.roomNumber);

    const groups: HotelGroup[] = [];
    if (withRoom.length > 0) {
      groups.push({
        hotelId: "assigned",
        hotelName: "Assigned Guests",
        location: "",
        guests: withRoom,
      });
    }
    if (withoutRoom.length > 0) {
      groups.push({
        hotelId: "unassigned",
        hotelName: "Pending Room Assignment",
        location: "",
        guests: withoutRoom,
      });
    }
    return groups;
  }, [hotelGuests]);

  const filteredGroups = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return hotelGroups;
    return hotelGroups
      .map((hotel) => {
        const matchedGuests = hotel.guests.filter(
          (g) =>
            g.guestName.toLowerCase().includes(query) ||
            g.roomNumber.toLowerCase().includes(query)
        );
        if (hotel.hotelName.toLowerCase().includes(query)) return hotel;
        if (matchedGuests.length > 0) return { ...hotel, guests: matchedGuests };
        return null;
      })
      .filter(Boolean) as HotelGroup[];
  }, [hotelGroups, searchText]);

  const totalGuests = hotelGroups.reduce((sum, h) => sum + h.guests.length, 0);
  const totalHotels = hotelGroups.length;
  const totalRooms = hotelGroups.reduce(
    (sum, h) => sum + h.guests.filter((g) => g.roomNumber).length,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={[]}>
      {/* Search */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center bg-gray-200/50 rounded-xl px-3.5 h-12">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-gray-900 font-jakarta"
            placeholder="Search guest, hotel or room..."
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
      </View>

      {/* Summary bar */}
      <View className="flex-row bg-white mx-4 mb-3 rounded-2xl py-3.5 shadow-sm">
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">{totalHotels}</Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">Hotels</Text>
        </View>
        <View className="w-px bg-gray-200 my-1" />
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">{totalGuests}</Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">Accepted</Text>
        </View>
        <View className="w-px bg-gray-200 my-1" />
        <View className="flex-1 items-center">
          <Text className="font-jakarta-bold text-xl text-primary">{totalRooms}</Text>
          <Text className="font-jakarta text-[11px] text-gray-500 mt-0.5">Rooms</Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#ee2b8c" />
          <Text className="font-jakarta text-sm text-gray-400">Loading hotel data...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.hotelId}
          renderItem={({ item }) => <HotelCard hotel={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center pt-16 gap-3">
              <Ionicons name="business-outline" size={48} color="#D1D5DB" />
              <Text className="font-jakarta text-sm text-gray-400">
                {hotelGuests.length === 0
                  ? "No accepted guests yet."
                  : "No hotel bookings found."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
