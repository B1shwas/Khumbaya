import { Text } from "@/src/components/ui/Text";
import { useSubmitRsvpResponse } from "@/src/features/events/hooks/use-event";
import { useRemoveInvitation } from "@/src/features/guests/api/use-guests";
import { useGuestDetailStore } from "@/src/features/guests/store/useGuestDetailStore";
import { formatDate, formatTime } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ViewGuestDetail() {
  const router = useRouter();
  const guestDetail = useGuestDetailStore((state) => state.guestDraft);

  const statusValue = guestDetail?.event_guest?.status?.toLowerCase?.() ?? "";
  const isConfirmed = statusValue === "accepted" || statusValue === "confirmed";

  const eventId = Number(guestDetail?.event_guest?.eventId ?? 0);
  const { mutate: submitRsvpResponse, isPending } =
    useSubmitRsvpResponse(eventId);
  const removeInvitationMutation = useRemoveInvitation();

  const initialRoom = guestDetail?.event_guest?.assigned_room ?? "";
  const initialArrivalInfo =
    guestDetail?.event_guest?.arrival_info ??
    guestDetail?.event_guest?.pickup_info ??
    "";
  const initialDepartureInfo = guestDetail?.event_guest?.departure_info ?? "";
  const [assignedRoom, setAssignedRoom] = useState(initialRoom);
  const [arrivalInfo, setArrivalInfo] = useState(initialArrivalInfo);
  const [departureInfo, setDepartureInfo] = useState(initialDepartureInfo);

  const hasAssignmentChanges = useMemo(() => {
    return (
      assignedRoom.trim() !== initialRoom.trim() ||
      arrivalInfo.trim() !== initialArrivalInfo.trim() ||
      departureInfo.trim() !== initialDepartureInfo.trim()
    );
  }, [
    assignedRoom,
    arrivalInfo,
    departureInfo,
    initialRoom,
    initialArrivalInfo,
    initialDepartureInfo,
  ]);

  const handleSaveAssignments = () => {
    if (
      !guestDetail?.event_guest ||
      !guestDetail?.user_detail?.id ||
      !eventId
    ) {
      return;
    }

    const payload = {
      userId: guestDetail.user_detail.id,
      familyId: guestDetail.event_guest.familyId,
      isAccomodation: guestDetail.event_guest.isAccomodation ?? undefined,
      isArrivalPickupRequired:
        guestDetail.event_guest.isArrivalPickupRequired ?? undefined,
      isDeparturePickupRequired:
        guestDetail.event_guest.isDeparturePickupRequired ?? undefined,
      assigned_room: assignedRoom.trim() || null,
      arrival_info: arrivalInfo.trim() || null,
      departure_info: departureInfo.trim() || null,
    };

    submitRsvpResponse(payload, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  const handleDeleteGuest = () => {
    if (!guestDetail?.user_detail?.id || !eventId) {
      Alert.alert("Error", "Missing event or guest id.");
      return;
    }

    const displayName =
      guestDetail.user_detail.username?.trim() ||
      guestDetail.user_detail.email ||
      "this guest";

    Alert.alert(
      "Remove guest",
      `Remove ${displayName}'s invitation from this event?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeInvitationMutation.mutateAsync({
                eventId,
                guestId: guestDetail.user_detail.id,
              });
              router.back();
            } catch (error: any) {
              const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove guest. Please try again.";
              Alert.alert("Error", message);
            }
          },
        },
      ]
    );
  };

  let messageForTransportation;

  if (
    guestDetail?.event_guest?.isArrivalPickupRequired &&
    guestDetail?.event_guest?.isDeparturePickupRequired
  ) {
    messageForTransportation = "Pickup and Departure";
  } else if (guestDetail?.event_guest?.isArrivalPickupRequired) {
    messageForTransportation = "Arrival Pickup";
  } else if (guestDetail?.event_guest?.isDeparturePickupRequired) {
    messageForTransportation = "Departure Pickup";
  } else {
    messageForTransportation = "Not Required";
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
      <SafeAreaView className="flex-1 bg-white" edges={[]}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 35,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={240}
          scrollEnabled={true}
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={["rgba(238,43,140,0.07)", "transparent"]}
              className="items-center px-6 pt-8 pb-8"
            >
              {!isConfirmed ? (
                <TouchableOpacity
                  onPress={handleDeleteGuest}
                  className="absolute right-4 top-4 p-2 rounded-full bg-white"
                  activeOpacity={0.8}
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              ) : null}

              <View className="relative">
                <View
                  className="w-32 h-32 rounded-full bg-primary border-4 border-white items-center justify-center"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <Text variant="h1" className="text-white text-4xl">
                    {guestDetail?.user_detail.username
                      ? guestDetail.user_detail.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                      : "US"}
                  </Text>
                </View>
                <View className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white bg-emerald-500" />
              </View>

              <Text
                variant="h1"
                className="text-slate-900 text-2xl mt-4 text-center"
              >
                {guestDetail?.user_detail.username || "User Name"}
              </Text>
              <Text variant="h2" className="text-primary text-sm mt-1">
                {isConfirmed ? "Confirmed" : "Pending"}{" "}
                Guest • {guestDetail?.event_guest.role || "VVIP"}
              </Text>
              {/* Only render date/time if both arrival and departure dates exist */}
              {guestDetail?.event_guest.arrival_date_time &&
                guestDetail?.event_guest.departure_date_time && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <View>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color="#94A3B8"
                          className="mr-2 "
                        />
                        <Text
                          variant="caption"
                          className=" text-sm text-center"
                        >
                          {formatDate(
                            guestDetail?.event_guest.arrival_date_time || "—"
                          )}{" "}
                          –{" "}
                          {formatDate(
                            guestDetail?.event_guest.departure_date_time || "—"
                          )}
                        </Text>
                      </View>

                      <Text variant="caption" className="text-sm text-center">
                        {formatTime(
                          guestDetail?.event_guest.arrival_date_time || "TBD"
                        )}{" "}
                        –{" "}
                        {formatTime(
                          guestDetail?.event_guest.departure_date_time || "TBD"
                        )}
                      </Text>
                    </View>
                  </View>
                )}
            </LinearGradient>

            <View className="flex-row gap-3 px-6 pb-6 border-b border-primary/5">
              <TouchableOpacity
                className="flex-1 bg-primary py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
                style={{
                  shadowColor: "#EE2B8C",
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 4,
                }}
              >
                <Ionicons name="chatbubble-outline" size={16} color="#fff" />
                <Text variant="h2" className="text-white text-sm">
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary/10 py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
              >
                <Ionicons name="call-outline" size={16} color="#EE2B8C" />
                <Text variant="h2" className="text-primary text-sm">
                  Call
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-6 pt-6 pb-10 gap-8">
              <View>
                <View className="flex-row items-center gap-2 mb-4">
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color="#EE2B8C"
                  />
                  <Text
                    variant="caption"
                    className="text-xs font-bold uppercase tracking-widest"
                  >
                    Guest Requirements
                  </Text>
                </View>
                <View className="bg-slate-50 rounded-2xl px-4">
                  {[
                    {
                      label: "Arrival Date",
                      value: `${formatDate(guestDetail?.event_guest.arrival_date_time || "TBD")}`,
                      pill: false,
                    },

                    {
                      label: "Departure Date",
                      value: `${formatDate(guestDetail?.event_guest.departure_date_time || "TBD")}`,
                      pill: false,
                    },
                    {
                      label: "Accommodation",
                      value: `${guestDetail?.event_guest.isAccomodation ? "Room Needed" : "Room not needed"}`,
                      pill: true,
                    },
                    {
                      label: "Arrival Pickup",
                      value: `${guestDetail?.event_guest.isArrivalPickupRequired ? "Required" : "Not Required"}`,
                      pill: true,
                    },
                    {
                      label: "Departure Pickup",
                      value: `${guestDetail?.event_guest.isDeparturePickupRequired ? "Required" : "Not Required"}`,
                      pill: true,
                    },
                    {
                      label: "Transport Summary",
                      value: messageForTransportation,
                      pill: false,
                    },
                    {
                      label: "Category",
                      value: guestDetail?.event_guest?.category,
                    },
                  ].map((row, i, arr) => (
                    <View
                      key={i}
                      className={`flex-row justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <Text variant="body" className="text-slate-500 text-sm">
                        {row.label}
                      </Text>
                      {row.pill ? (
                        <View className="bg-primary/10 px-3 py-1 rounded-full">
                          <Text variant="h2" className="text-primary text-xs">
                            {row.value.charAt(0).toUpperCase() +
                              row.value.slice(1)}
                          </Text>
                        </View>
                      ) : (
                        <Text variant="h2" className="text-slate-900 text-sm">
                          {row.value
                            ? row.value?.charAt(0).toUpperCase() +
                            row.value?.slice(1)
                            : "-"}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>

              <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-row gap-3 flex-1">
                    <View className="p-2 bg-primary/5 rounded-xl">
                      <Ionicons name="book-outline" size={24} color="#EE2B8C" />
                    </View>
                    <View>
                      <Text variant="caption" className="text-xs mb-0.5">
                        Notes
                      </Text>
                      <Text variant="h2" className="text-slate-900 text-sm">
                        {guestDetail?.event_guest.notes ||
                          "No additional notes"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="p-1.5 rounded-lg"
                    activeOpacity={0.7}
                  ></TouchableOpacity>
                </View>
              </View>

              {(guestDetail?.event_guest?.isAccomodation ||
                guestDetail?.event_guest?.isArrivalPickupRequired ||
                guestDetail?.event_guest?.isDeparturePickupRequired) && (
                  <View>
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={20}
                          color="#EE2B8C"
                        />
                        <Text
                          variant="caption"
                          className="text-xs font-bold uppercase tracking-widest"
                        >
                          Host Assignments
                        </Text>
                      </View>
                      <View className="bg-slate-100 px-2 py-0.5 rounded">
                        <Text
                          variant="caption"
                          className="text-[10px] uppercase font-bold"
                        >
                          Internal Use
                        </Text>
                      </View>
                    </View>

                    {guestDetail.event_guest.isAccomodation && (
                      <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                        <View className="flex-row items-center gap-2 mb-3">
                          <Ionicons
                            name="bed-outline"
                            size={20}
                            color="#EE2B8C"
                          />
                          <Text variant="caption" className="text-xs">
                            Room Assigned
                          </Text>
                        </View>
                        <TextInput
                          value={assignedRoom}
                          onChangeText={setAssignedRoom}
                          placeholder="Assign room"
                          placeholderTextColor="#94a3b8"
                          className="w-full bg-slate-50 rounded-md p-4 text-sm text-slate-900"
                        />
                      </View>
                    )}

                    {guestDetail.event_guest.isArrivalPickupRequired && (
                      <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                        <View className="flex-row items-center gap-2 mb-3">
                          <Ionicons
                            name="car-outline"
                            size={20}
                            color="#EE2B8C"
                          />
                          <Text variant="caption" className="text-xs">
                            Arrival Pickup Assigned
                          </Text>
                        </View>
                        <TextInput
                          value={arrivalInfo}
                          onChangeText={setArrivalInfo}
                          placeholder="Driver / pickup details"
                          placeholderTextColor="#94a3b8"
                          className="w-full bg-slate-50 rounded-md p-4 text-sm text-slate-900"
                        />
                      </View>
                    )}

                    {guestDetail.event_guest.isDeparturePickupRequired && (
                      <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                        <View className="flex-row items-center gap-2 mb-3">
                          <Ionicons
                            name="car-sport-outline"
                            size={20}
                            color="#EE2B8C"
                          />
                          <Text variant="caption" className="text-xs">
                            Departure Pickup Assigned
                          </Text>
                        </View>
                        <TextInput
                          value={departureInfo}
                          onChangeText={setDepartureInfo}
                          placeholder="Driver / departure details"
                          placeholderTextColor="#94a3b8"
                          className="w-full bg-slate-50 rounded-md p-4 text-sm text-slate-900"
                        />
                      </View>
                    )}

                    <TouchableOpacity
                      className="bg-primary py-3 rounded-xl items-center justify-center"
                      activeOpacity={0.85}
                      onPress={handleSaveAssignments}
                      disabled={isPending || !hasAssignmentChanges}
                      style={{
                        opacity: isPending || !hasAssignmentChanges ? 0.6 : 1,
                      }}
                    >
                      {isPending ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text variant="h2" className="text-white text-sm">
                          Save Assignments
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
