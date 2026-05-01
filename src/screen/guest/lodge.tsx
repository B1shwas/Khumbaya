import { Text } from "@/src/components/ui/Text";
import {
  useEventById,
  useEventResponseWithUser,
} from "@/src/features/events/hooks/use-event";
import { GuestDetailInterface } from "@/src/features/guests/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SectionLabel({ children }: { children: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-4">
      <View className="h-px flex-1 bg-slate-100" />
      <Text className="text-[10px] uppercase tracking-[2px] text-slate-400 font-jakarta-semibold">
        {children}
      </Text>
      <View className="h-px flex-1 bg-slate-100" />
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-slate-50">
      <View
        className={`w-8 h-8 rounded-xl items-center justify-center ${
          accent ? "bg-pink-50" : "bg-slate-50"
        }`}
      >
        <Ionicons
          name={icon}
          size={15}
          color={accent ? "#ee2b8c" : "#94a3b8"}
        />
      </View>
      <View className="flex-1">
        <Text className="text-[10px] uppercase tracking-[1.5px] text-slate-400 mb-0.5">
          {label}
        </Text>
        <Text
          className={`text-sm font-jakarta-semibold ${
            value === "Not available" || value === "Not assigned yet"
              ? "text-slate-400"
              : "text-slate-800"
          }`}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function TravelBlock({
  type,
  date,
  time,
  location,
}: {
  type: "arrival" | "departure";
  date: string;
  time: string;
  location: string;
}) {
  const isArrival = type === "arrival";
  return (
    <View className="flex-1 rounded-2xl bg-slate-50 p-4">
      <View className="flex-row items-center gap-1.5 mb-3">
        <Ionicons
          name={isArrival ? "arrow-down-circle" : "arrow-up-circle"}
          size={14}
          color={isArrival ? "#10b981" : "#f59e0b"}
        />
        <Text
          className={`text-[10px] uppercase tracking-[1.5px] font-jakarta-semibold ${
            isArrival ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {isArrival ? "Arrival" : "Departure"}
        </Text>
      </View>
      <Text className="text-sm font-jakarta-bold text-slate-900">{date}</Text>
      <Text className="text-xs text-slate-500 mt-0.5">{time}</Text>
      <View className="h-px bg-slate-200 my-2.5" />
      <Text className="text-xs text-slate-500 leading-relaxed">{location}</Text>
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
    return (eventResponse?.responses ?? []) as GuestDetailInterface[];
  }, [eventResponse]);

  const guestRecord = responses[0]?.eventGuest ?? null;
  const guestName = responses[0]?.user?.username ?? "Guest";
  const hasFamily = responses.length > 1;
  const isLoading = isEventLoading || isResponseLoading;

  if (!numericEventId) {
    return (
      <SafeAreaView
        className="flex-1 bg-slate-50 items-center justify-center"
        edges={["top"]}
      >
        <View className="items-center gap-3 px-8">
          <View className="w-14 h-14 rounded-full bg-pink-50 items-center justify-center">
            <Ionicons name="alert-circle-outline" size={28} color="#ee2b8c" />
          </View>
          <Text className="text-sm text-slate-500 text-center leading-relaxed">
            Event ID is missing from the route.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-slate-50 items-center justify-center"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#ee2b8c" />
        <Text className="text-xs text-slate-400 mt-3 tracking-wide">
          Loading details…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-6 pb-5">
          <View className="flex-row items-center gap-2 mb-1">
            {/* <View className="w-1.5 h-5 rounded-full bg-pink-500" /> */}
            {/* <Text className="text-[11px] uppercase tracking-[2px] text-pink-400 font-jakarta-semibold">
              Accommodation
            </Text> */}
          </View>
          <Text className="text-2xl font-jakarta-bold text-slate-900 mt-1">
            Hotel & Room Details
          </Text>
          {/* <Text className="text-sm text-slate-400 mt-1 leading-relaxed">
            Viewing details for{" "}
            <Text className="text-slate-600 font-jakarta-semibold">
              {guestName}
            </Text>
          </Text> */}
        </View>

        {/* Venue Card */}
        {/* <View className="mx-5 mb-4 rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm">
          <View className="bg-pink-500 px-5 py-4">
            <Text className="text-[10px] uppercase tracking-[2px] text-pink-200 mb-1">
              Venue
            </Text>
            <Text className="text-lg font-jakarta-bold text-white leading-snug">
              {eventDetails?.location || "Hotel details not available"}
            </Text>
            <Text className="text-sm text-pink-200 mt-0.5">
              {eventDetails?.title || "Event location"}
            </Text>
          </View>

          <View className="px-5 pt-4 pb-5">
            <InfoRow
              icon="bed-outline"
              label="Room allocation"
              value={guestRecord?.assignedRoom || "Not assigned yet"}
              accent
            />
            <InfoRow
              icon="shield-checkmark-outline"
              label="Accommodation status"
              value={
                guestRecord?.isAccomodation
                  ? "Room requested"
                  : "No room requested"
              }
              accent={!!guestRecord?.isAccomodation}
            />
            <InfoRow
              icon="document-text-outline"
              label="Notes"
              value={formatNullable(guestRecord?.notes)}
            />
          </View>
        </View> */}

        {/* Travel Block */}
        {/* <View className="mx-5 mb-4 bg-white rounded-3xl border border-slate-100 p-5">
          <SectionLabel>Travel schedule</SectionLabel>
          <View className="flex-row gap-3">
            <TravelBlock
              type="arrival"
              date={formatDate(guestRecord?.arrivalDatetime)}
              time={formatTime(guestRecord?.arrivalDatetime)}
              location={formatNullable(guestRecord?.arrivalInfo)}
            />
            <TravelBlock
              type="departure"
              date={formatDate(guestRecord?.departureDatetime)}
              time={formatTime(guestRecord?.departureDatetime)}
              location={formatNullable(guestRecord?.departureInfo)}
            />
          </View>
        </View> */}

        {/* Family Section */}
        {hasFamily && (
          <View className="mx-5">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="people-outline" size={16} color="#94a3b8" />
              <Text className="text-sm font-jakarta-semibold text-slate-700">
                Family room assignments
              </Text>
              <View className="ml-auto bg-pink-50 rounded-full px-2.5 py-0.5">
                <Text className="text-xs font-jakarta-semibold text-pink-500">
                  {responses.length}
                </Text>
              </View>
            </View>

            <View className="gap-3">
              {responses.map((response, index) => {
                const memberName =
                  response.user?.username ?? `Guest ${index + 1}`;
                const roomAllocation =
                  response.eventGuest?.assignedRoom || "Not assigned";
                const hasRoom = !!response.eventGuest?.isAccomodation;

                return (
                  <View
                    key={`family-room-${index}`}
                    className="bg-white rounded-2xl border border-slate-100 px-4 py-3.5 flex-row items-center gap-3"
                  >
                    <View className="w-9 h-9 rounded-full bg-pink-50 items-center justify-center">
                      <Text className="text-sm font-jakarta-bold text-pink-500">
                        {memberName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-jakarta-bold text-slate-800">
                        {memberName}
                      </Text>
                      <View className="mt-2 flex-row items-center gap-2">
                        <View className="rounded-full bg-slate-100 px-2.5 py-1">
                          <Text className="text-[10px] font-jakarta-semibold text-slate-500">
                            {roomAllocation}
                          </Text>
                        </View>
                        <View
                          className={`rounded-full px-2.5 py-1 ${
                            hasRoom ? "bg-emerald-50" : "bg-slate-100"
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-jakarta-semibold ${
                              hasRoom ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            {hasRoom ? "Requested" : "No room"}
                          </Text>
                        </View>
                      </View>
                    </View>
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
