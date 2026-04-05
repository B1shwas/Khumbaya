import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetInvitationsForEvent } from "@/src/features/guests/api/use-guests";
import type { GuestDetailInterface } from "@/src/features/guests/types";
import { useGetHotelsForEvent } from "@/src/features/hotel/api/use-hotel";

interface GuestRow {
  guestId: number;
  guestName: string;
  roomNumber: string;
  roomType: string | null;
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
    <View style={styles.guestRow}>
      <View style={styles.guestAvatar}>
        <Text style={styles.guestAvatarText}>{getInitials(guest.guestName)}</Text>
      </View>
      <View style={styles.guestInfo}>
        <Text style={styles.guestName}>{guest.guestName}</Text>
        <View style={styles.roomRow}>
          {guest.roomNumber ? (
            <>
              <Ionicons name="bed-outline" size={12} color="#9CA3AF" />
              <Text style={styles.roomLabel}>Room {guest.roomNumber}</Text>
              {guest.roomType ? (
                <>
                  <Text style={styles.roomDot}>·</Text>
                  <Text style={styles.roomType}>{guest.roomType}</Text>
                </>
              ) : null}
            </>
          ) : (
            <Text style={styles.roomUnassigned}>Room not assigned</Text>
          )}
        </View>
      </View>
      {guest.roomNumber ? (
        <View style={styles.roomBadge}>
          <Text style={styles.roomBadgeText}>{guest.roomNumber}</Text>
        </View>
      ) : (
        <View style={styles.roomBadgePending}>
          <Text style={styles.roomBadgePendingText}>—</Text>
        </View>
      )}
    </View>
  );
}

function HotelCard({ hotel }: { hotel: HotelGroup }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.hotelCard}>
      <TouchableOpacity
        style={styles.hotelHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.hotelIconWrap}>
          <Ionicons name="business" size={22} color="#ee2b8c" />
        </View>
        <View style={styles.hotelMeta}>
          <Text style={styles.hotelName}>{hotel.hotelName}</Text>
          {hotel.location ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="#9CA3AF" />
              <Text style={styles.locationText}>{hotel.location}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.hotelStats}>
          <Text style={styles.statCount}>{hotel.guests.length}</Text>
          <Text style={styles.statLabel}>guests</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#9CA3AF"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {expanded && <View style={styles.divider} />}

      {expanded && (
        <View style={styles.guestList}>
          {hotel.guests.map((guest, index) => (
            <View key={guest.guestId}>
              <GuestRowItem guest={guest} />
              {index < hotel.guests.length - 1 && <View style={styles.guestDivider} />}
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

  const { data: invitations, isLoading: loadingGuests } = useGetInvitationsForEvent(numericEventId);
  const { data: hotels, isLoading: loadingHotels } = useGetHotelsForEvent(numericEventId);

  const isLoading = loadingGuests || loadingHotels;

  // Filter only accepted guests
  const acceptedGuests: GuestDetailInterface[] = useMemo(() => {
    if (!invitations) return [];
return invitations.filter(
      (g: GuestDetailInterface) =>
        String(g.event_guest.status ?? "").trim().toLowerCase() === "accepted"
    );
  }, [invitations]);

  // Group accepted guests by hotel
  // Uses event_guest.assigned_room as room number and matches to hotels list
  const hotelGroups: HotelGroup[] = useMemo(() => {
    if (!acceptedGuests.length) return [];

    // Build hotel lookup from hotels API (if available)
    const hotelMap = new Map<number, { name: string; location: string }>();
    if (hotels) {
      hotels.forEach((h) => hotelMap.set(h.id, { name: h.name, location: h.location }));
    }

    // Group guests by their assigned hotel (using assigned_room field)
    // If backend provides hotelId on event_guest in future, use that
    const ungrouped: GuestRow[] = acceptedGuests.map((g) => ({
      guestId: g.event_guest.id,
      guestName: g.user_detail.username,
      roomNumber: g.event_guest.assigned_room ?? "",
      roomType: null,
      phone: g.user_detail.phone,
    }));

    // If hotels data exists, map guests to hotels via allocations
    // For now: guests with a room → grouped under their hotel; guests without → "Unassigned"
    if (hotels && hotels.length > 0) {
      // Return one card per hotel with their guests (backend will provide allocation mapping)
      return hotels.map((hotel) => ({
        hotelId: String(hotel.id),
        hotelName: hotel.name,
        location: hotel.location,
        guests: ungrouped, // TODO: filter by hotel allocation when backend ready
      })).filter((h) => h.guests.length > 0);
    }

    // Fallback: single group showing all accepted guests with their room info
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
  }, [acceptedGuests, hotels]);

  const filteredGroups = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return hotelGroups;
    return hotelGroups
      .map((hotel) => {
        const matchedGuests = hotel.guests.filter(
          (g) =>
            g.guestName.toLowerCase().includes(query) ||
            g.roomNumber.toLowerCase().includes(query) ||
            (g.roomType ?? "").toLowerCase().includes(query)
        );
        if (hotel.hotelName.toLowerCase().includes(query)) return hotel;
        if (matchedGuests.length > 0) return { ...hotel, guests: matchedGuests };
        return null;
      })
      .filter(Boolean) as HotelGroup[];
  }, [hotelGroups, searchText]);

  const totalGuests = hotelGroups.reduce((sum, h) => sum + h.guests.length, 0);
  const totalHotels = hotels?.length ?? 0;
  const totalRooms = hotelGroups.reduce(
    (sum, h) => sum + h.guests.filter((g) => g.roomNumber).length,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
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
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{totalHotels}</Text>
          <Text style={styles.summaryLabel}>Hotels</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{totalGuests}</Text>
          <Text style={styles.summaryLabel}>Accepted</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{totalRooms}</Text>
          <Text style={styles.summaryLabel}>Rooms</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#ee2b8c" />
          <Text style={styles.loadingText}>Loading hotel data...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.hotelId}
          renderItem={({ item }) => <HotelCard hotel={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                {acceptedGuests.length === 0
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(209,213,219,0.5)",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontFamily: "PlusJakartaSans-Regular",
  },
  summaryBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    color: "#ee2b8c",
  },
  summaryLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  hotelCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  hotelHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  hotelIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hotelMeta: {
    flex: 1,
  },
  hotelName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    color: "#181114",
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#9CA3AF",
  },
  hotelStats: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statCount: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
  },
  statLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 10,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  guestList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  guestAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  guestAvatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: "#ee2b8c",
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
    marginBottom: 2,
  },
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  roomLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  roomDot: {
    color: "#D1D5DB",
    fontSize: 12,
  },
  roomType: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#9CA3AF",
  },
  roomUnassigned: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#D1D5DB",
    fontStyle: "italic",
  },
  roomBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roomBadgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: "#3B82F6",
  },
  roomBadgePending: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roomBadgePendingText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: "#9CA3AF",
  },
  guestDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#9CA3AF",
  },
});
