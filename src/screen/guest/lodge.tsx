import { Text } from "@/src/components/ui/Text";
import {
  useEventById,
  useEventResponseWithUser,
} from "@/src/features/events/hooks/use-event";
import { formatDate, formatTime } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-3 mb-4">
      <View className="w-10 h-10 rounded-2xl bg-pink-100 items-center justify-center">
        <Ionicons name={icon} size={18} color="#ee2b8c" />
      </View>
      <View className="flex-1">
        <Text className="text-xs uppercase tracking-[1px] text-slate-400 mb-1">
          {label}
        </Text>
        <Text className="text-base font-jakarta-semibold text-slate-900">
          {value}
        </Text>
      </View>
    </View>
  );
}

const formatNullable = (value?: string | null) =>
  value?.trim() || "Not available";

export default function Lodge() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const numericEventId = eventId ? Number(eventId) : 0;

  const { data: eventDetails, isLoading: isEventLoading } =
    useEventById(numericEventId);
  const { data: eventResponse, isLoading: isResponseLoading } =
    useEventResponseWithUser(numericEventId);

  const responses = useMemo(() => {
    return (eventResponse?.responses ?? []) as Array<{
      event_guest?: Record<string, any> | null;
      user_detail?: Record<string, any>;
    }>;
  }, [eventResponse]);

  const guestRecord = responses[0]?.event_guest ?? null;
  const guestName = responses[0]?.user_detail?.username ?? "Guest";
  const hasFamily = responses.length > 1;

  const isLoading = isEventLoading || isResponseLoading;

  if (!numericEventId) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-light items-center justify-center"
        edges={["top"]}
      >
        <Text className="text-sm text-slate-500">
          Event ID is missing from the route.
        </Text>
      </SafeAreaView>
    );
  }

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
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-5">
          <Text className="text-2xl font-jakarta-bold text-slate-900 mb-2">
            Hotel & Room Details
          </Text>
          <Text className="text-sm text-slate-500 leading-relaxed">
            View accommodation information for {guestName}.
          </Text>
        </View>

        <View className="mx-5 mt-5 bg-white rounded-[32px] border border-slate-100 p-5 shadow-sm">
          <Text className="text-sm uppercase tracking-[1.5px] text-slate-400 mb-3">
            Hotel information
          </Text>
          <View className="rounded-3xl bg-slate-50 p-4 mb-4">
            <Text className="text-lg font-jakarta-semibold text-slate-900">
              {eventDetails?.location || "Hotel details not available"}
            </Text>
            <Text className="text-sm text-slate-500 mt-2">
              {eventDetails?.title || "Event location"}
            </Text>
          </View>

          <InfoRow
            icon="bed-outline"
            label="Room allocation"
            value={guestRecord?.assigned_room || "Not assigned yet"}
          />
          <InfoRow
            icon="key-outline"
            label="Accommodation status"
            value={
              guestRecord?.isAccomodation
                ? "Room requested"
                : "No room requested"
            }
          />
          <InfoRow
            icon="calendar-outline"
            label="Arrival date"
            value={formatDate(guestRecord?.arrival_date_time)}
          />
          <InfoRow
            icon="arrow-up-outline"
            label="Arrival time"
            value={formatTime(guestRecord?.arrival_date_time)}
          />
          <InfoRow
            icon="location-outline"
            label="Arrival location"
            value={formatNullable(guestRecord?.arrival_info)}
          />
          <InfoRow
            icon="calendar-outline"
            label="Departure date"
            value={formatDate(guestRecord?.departure_date_time)}
          />
          <InfoRow
            icon="arrow-down-outline"
            label="Departure time"
            value={formatTime(guestRecord?.departure_date_time)}
          />
          <InfoRow
            icon="location-outline"
            label="Departure location"
            value={formatNullable(guestRecord?.departure_info)}
          />
          <InfoRow
            icon="document-text-outline"
            label="Notes"
            value={formatNullable(guestRecord?.notes)}
          />
        </View>

        {hasFamily && (
          <View className="mx-5 mt-6">
            <Text className="text-base font-jakarta-semibold text-slate-900 mb-4">
              Family room assignments
            </Text>
            <View className="space-y-4">
              {responses.map((response, index) => {
                const memberName =
                  response.user_detail?.username ?? `Guest ${index + 1}`;
                const roomAllocation =
                  response.event_guest?.assigned_room || "Not assigned";
                const accomodationText = response.event_guest?.isAccomodation
                  ? "Room requested"
                  : "No room requested";

                return (
                  <View
                    key={`family-room-${index}`}
                    className="rounded-3xl bg-white border border-slate-100 p-4 shadow-sm"
                  >
                    <Text className="text-sm font-jakarta-bold text-slate-900 mb-2">
                      {memberName}
                    </Text>
                    <Text className="text-sm text-slate-600">
                      {roomAllocation}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-1">
                      {accomodationText}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
