import GuestDetailsInfo from "@/src/components/guest/GuestDetailsInfo";
import { Text } from "@/src/components/ui/Text";
import { useEventResponseWithUser } from "@/src/features/events/hooks/use-event";
import { useRsvpStore } from "@/src/store/useRsvpStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GuestDetailsScreenProps {
  guest?: any;
}

export default function GuestDetailsScreen({
  guest: propGuest,
}: GuestDetailsScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const draft = useRsvpStore((s) => s.draft);
  const eventId = params.eventId as string;
  const { data: eventResponses, isLoading } = useEventResponseWithUser(
    eventId ? Number(eventId) : 0
  );

  const guest = useMemo(() => {
    if (propGuest) return propGuest;

    // 1. Look for matching draft in store
    if (draft && eventResponses?.responses) {
      const responseData = eventResponses.responses.find(
        (r: any) => r.user_detail.id === draft.userId
      );
      if (responseData) {
        return {
          id: draft.userId,
          name: draft.memberName || responseData.user_detail.username,
          status:
            draft.rawStatus === "accepted"
              ? "Confirmed"
              : draft.rawStatus === "rejected"
                ? "Declined"
                : "Pending",
          avatar: responseData.user_detail.photo,
          phone: responseData.user_detail.phone,
          email: responseData.user_detail.email,
          roomAllocation: draft.rawAssignedRoom,
          arrivalDate: draft.rawArrival,
          departureDate: draft.rawDeparture,
          arrivalLocation: draft.rawArrivalInfo,
          departureLocation: draft.rawDepartureInfo,
          notes: draft.rawNotes,
          totalGuests: 1,
          relation: responseData.user_detail.relation,
          category: responseData.event_guest?.role,
        };
      }
    }

    // 2. Fallback to API first response (if individual)
    if (eventResponses?.responses && !draft && !eventResponses.isFamily) {
      const r = eventResponses.responses[0];
      return {
        id: r.user_detail.id,
        name: r.user_detail.username,
        status:
          r.event_guest?.status === "accepted" ? "Confirmed" : "Pending",
        avatar: r.user_detail.photo,
        phone: r.user_detail.phone,
        email: r.user_detail.email,
        roomAllocation: r.event_guest?.assigned_room,
        arrivalDate: r.event_guest?.arrival_date_time,
        departureDate: r.event_guest?.departure_date_time,
        arrivalLocation: r.event_guest?.arrival_info,
        departureLocation: r.event_guest?.departure_info,
        notes: r.event_guest?.notes,
        relation: r.user_detail.relation,
        category: r.event_guest?.role,
      };
    }

    // 3. Fallback to URL params
    if (params.guest) {
      try {
        return JSON.parse(params.guest as string);
      } catch (e) {
        console.warn("Failed to parse guest from params", e);
      }
    }
    return null;
  }, [propGuest, draft, eventResponses, params.guest]);

  if (!propGuest && !params.guest && !guest && isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  if (!guest) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-lg text-gray-500 mt-4 mb-6">
            Guest not found
          </Text>
          <TouchableOpacity
            className="bg-pink-600 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isConfirmed = guest.status === "Confirmed";

  return (< GuestDetailsInfo
    guest={guest}
    isConfirmed={isConfirmed}
    isOrganizer={false}
  />

  );
}
