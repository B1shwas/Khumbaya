import { Text } from "@/src/components/ui/Text";
import { useGetEventGuests, useGetGuestRoom } from "@/src/features/guests/api/use-guests";
import { formatDate } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LodgingPage() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const eventIdNum = eventId ? Number(eventId) : null;

  const { data: guests, isLoading: guestsLoading } =
    useGetEventGuests(eventIdNum);
  const { data: roomData, isLoading: roomLoading } =
    useGetGuestRoom(eventIdNum);

  const isLoading = guestsLoading || roomLoading;

  // Filter guests who need accommodation
  const guestsWithAccommodation = (guests ?? []).filter(
    (guest: any) => guest.event_guest?.isAccomodation === true
  );

  // Get room assignments from roomData (API returns array with user_room field)
  const roomAssignments: { [guestId: number]: string } = {};
  if (Array.isArray(roomData)) {
    roomData.forEach((assignment: any) => {
      if (assignment?.user_detail?.id && assignment.user_room) {
        roomAssignments[assignment.user_detail.id] = assignment.user_room;
      }
    });
  }

  const getGuestRoom = (userId: number) => {
    return roomAssignments[userId] || "Not Assigned";
  };

  const roomOverviewRows = Array.isArray(roomData)
    ? Object.entries(
        roomData.reduce((overview: Record<string, number>, item: any) => {
          const room = item?.user_room?.trim();
          if (room) {
            overview[room] = (overview[room] ?? 0) + 1;
          }
          return overview;
        }, {})
      )
    : [];

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-light items-center justify-center"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        {/* Header */}
        <View className="px-5 py-4 border-b border-gray-200 bg-white">
          <View className="flex-row items-center gap-3">
            <Ionicons name="bed-outline" size={28} color="#ee2b8c" />
            <View>
              <Text variant="h1" className="text-xl font-bold">
                Lodging Services
              </Text>
              <Text className="text-gray-500 text-sm">
                {guestsWithAccommodation.length} guest(s) requiring
                accommodation
              </Text>
            </View>
          </View>
        </View>

        {/* Guests List */}
        <View className="px-5 pt-5">
          <Text variant="h2" className="text-base font-semibold mb-3">
            Guests Needing Accommodation
          </Text>

          {guestsWithAccommodation.length === 0 ? (
            <View className="items-center py-10 bg-white rounded-md">
              <Ionicons name="bed-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-400 mt-3">
                No guests require lodging
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {guestsWithAccommodation.map((guestWithDetail: any) => {
                const guest = guestWithDetail.user_detail;
                const eventGuest = guestWithDetail.event_guest;
                const assignedRoom = guest?.id
                  ? getGuestRoom(guest.id)
                  : "Not Assigned";

                return (
                  <View
                    key={
                      guest?.id ??
                      guestWithDetail.event_guest?.id ??
                      Math.random()
                    }
                    className="bg-white p-4 rounded-md border border-gray-200"
                  >
                    <View className="flex-row items-start gap-3">
                      {/* Guest Avatar */}
                      <View className="w-12 h-12 rounded-full bg-pink-100 items-center justify-center">
                        {guest.photo ? (
                          <Ionicons name="person" size={24} color="#ee2b8c" />
                        ) : (
                          <Ionicons
                            name="person-outline"
                            size={24}
                            color="#ee2b8c"
                          />
                        )}
                      </View>

                      {/* Guest Details */}
                      <View className="flex-1">
                        <Text className="font-semibold text-base">
                          {guest.username}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {guest.email}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {guest.phone}
                        </Text>
                      </View>

                      {/* Accommodation Status */}
                      <View
                        className={`px-2 py-1 rounded ${eventGuest?.isAccomodation ? "bg-green-100" : "bg-gray-100"}`}
                      >
                        <Text
                          className={`text-xs ${eventGuest?.isAccomodation ? "text-green-700" : "text-gray-600"}`}
                        >
                          {eventGuest?.isAccomodation
                            ? "Lodging"
                            : "No Lodging"}
                        </Text>
                      </View>
                    </View>

                    {/* Room Assignment */}
                    <View className="mt-3 pt-3 border-t border-gray-100">
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name="home-outline"
                          size={16}
                          color="#6b7280"
                        />
                        <Text className="text-sm text-gray-600">
                          Room:{" "}
                          <Text className="font-medium">{assignedRoom}</Text>
                        </Text>
                      </View>
                    </View>

                    {/* Arrival/Departure */}
                    <View className="mt-2 flex-row gap-4">
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#6b7280"
                        />
                        <Text className="text-sm text-gray-600">
                          Arrives:{" "}
                          {eventGuest.arrival_date_time
                            ? formatDate(eventGuest.arrival_date_time)
                            : "TBD"}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#6b7280"
                        />
                        <Text className="text-sm text-gray-600">
                          Departs:{" "}
                          {eventGuest.departure_date_time
                            ? formatDate(eventGuest.departure_date_time)
                            : "TBD"}
                        </Text>
                      </View>
                    </View>

                    {/* Pickup Requirements */}
                    {(eventGuest.isArrivalPickupRequired ||
                      eventGuest.isDeparturePickupRequired) && (
                      <View className="mt-2 flex-row gap-2">
                        {eventGuest.isArrivalPickupRequired && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons
                              name="car-outline"
                              size={14}
                              color="#ee2b8c"
                            />
                            <Text className="text-xs text-pink-600">
                              Arrival pickup
                            </Text>
                          </View>
                        )}
                        {eventGuest.isDeparturePickupRequired && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons
                              name="car-outline"
                              size={14}
                              color="#ee2b8c"
                            />
                            <Text className="text-xs text-pink-600">
                              Departure pickup
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Room Overview */}
        {roomOverviewRows.length > 0 && (
          <View className="px-5 pt-5">
            <Text variant="h2" className="text-base font-semibold mb-3">
              Room Overview
            </Text>
            <View className="gap-2">
              {roomOverviewRows.map(([roomName, count]) => (
                <View
                  key={roomName}
                  className="bg-white p-4 rounded-md border border-gray-200 flex-row items-center justify-between"
                >
                  <View>
                    <Text className="font-medium">{roomName}</Text>
                    <Text className="text-gray-500 text-sm">
                      Assigned Guests: {count}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="people-outline" size={20} color="#ee2b8c" />
                    <Text className="text-pink-600 font-semibold">
                      {count} assigned
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Back Button */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            className="bg-primary py-3 rounded-md items-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
