import { DatePicker } from "@/components/nativewindui/DatePicker";
import { useSubmitRsvpResponse } from "@/src/features/events/hooks/use-event";
import { useAuthStore } from "@/src/store/AuthStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckSquare, Square } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#ee2b8c";

const Icon = ({
  name,
  size = 20,
}: {
  name: string;
  color?: string;
  size?: number;
}) => (
  <MaterialIcons
    name={name.replace(/_/g, "-") as keyof typeof MaterialIcons.glyphMap}
    className="!text-primary"
    size={size}
  />
);

/** Inner form fields — safe to embed inside a parent ScrollView */
export const RSVPFormContent = ({
  userId,
  eventId,
  familyId,
  memberName,
  initialAttendance = "yes",
  initialAccommodation = false,
  initialArrival,
  initialDeparture,
  initialNotes = "",
}: {
  userId: string;
  eventId: number;
  familyId?: number;
  memberName?: string;
  initialAttendance?: string;
  initialAccommodation?: boolean;
  initialArrival?: Date;
  initialDeparture?: Date;
  initialNotes?: string;
}) => {
  const router = useRouter();
  const { mutate: submitRsvp, isPending } = useSubmitRsvpResponse(eventId);

  const [attendance, setAttendance] = useState(initialAttendance);
  const [accommodation, setAccommodation] = useState(initialAccommodation);
  const [arrivalPickup, setArrivalPickup] = useState(!!initialArrival);
  const [departureDrop, setDepartureDrop] = useState(!!initialDeparture);
  const [notes, setNotes] = useState(initialNotes);
  const [arrivalDateTime, setArrivalDateTime] = useState(
    initialArrival ?? new Date()
  );
  const [departureDateTime, setDepartureDateTime] = useState(
    initialDeparture ?? new Date()
  );

  const makeDateHandler =
    (setter: (d: Date) => void) =>
    (event: DateTimePickerEvent, picked?: Date) => {
      if (event.type === "dismissed" || !picked) return;
      setter(picked);
    };

  const handleSubmit = () => {
    submitRsvp(
      {
        userId,
        familyId,
        notes: notes.trim() || undefined,
        arrival_date_time: arrivalDateTime.toISOString(),
        departure_date_time: departureDateTime.toISOString(),
        isAccomodation: accommodation.toString(),
        status:
          attendance === "yes"
            ? "accepted"
            : attendance === "no"
              ? "rejected"
              : "maybe",
      },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <View className="px-5 py-4 gap-8">
      {/* Attendance */}
      <View>
        <View className="flex-row items-center gap-2 mb-4">
          <Icon name="event_available" />
          <Text className="font-bold text-slate-800">Will you attend?</Text>
        </View>
        <View className="flex-row bg-pink-50 p-1.5 rounded-md">
          {["yes", "no", "maybe"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setAttendance(option)}
              className={`flex-1 py-2.5 rounded-lg ${
                attendance === option ? "bg-[#ee2b8c]" : ""
              }`}
              style={attendance === option ? { backgroundColor: PRIMARY } : {}}
            >
              <Text
                className={`text-center font-semibold text-sm capitalize ${
                  attendance === option ? "text-white" : "text-slate-600"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Travel Details */}
      <View>
        <View className="flex-row items-center gap-2 mb-4">
          <Icon name="flight_takeoff" />
          <Text className="font-bold text-slate-800">Travel Itinerary</Text>
        </View>
        <View className="gap-4">
          <View>
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-1.5">
              Arrival Date & Time
            </Text>
            <DatePicker
              value={arrivalDateTime}
              mode="datetime"
              onChange={makeDateHandler(setArrivalDateTime)}
              materialDateLabel="Arrival Date"
              materialTimeLabel="Arrival Time"
            />
          </View>
          <View>
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-1.5">
              Departure Date & Time
            </Text>
            <DatePicker
              value={departureDateTime}
              mode="datetime"
              onChange={makeDateHandler(setDepartureDateTime)}
              materialDateLabel="Departure Date"
              materialTimeLabel="Departure Time"
            />
          </View>
        </View>
      </View>

      {/* Toggle Options */}
      <View className="gap-5">
        <View className="flex-row items-center justify-between p-4 bg-pink-50 rounded-md border border-pink-100">
          <View className="flex-row items-center gap-3">
            <Icon name="hotel" />
            <View>
              <Text className="font-bold text-sm text-slate-900">
                Accommodation Required?
              </Text>
              <Text className="text-xs text-slate-500">
                Do you need a room booked?
              </Text>
            </View>
          </View>
          <Switch
            value={accommodation}
            onValueChange={setAccommodation}
            trackColor={{ false: "#e2e8f0", true: PRIMARY }}
            thumbColor="#ffffff"
          />
        </View>

        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Icon name="directions_car" />
            <Text className="font-bold text-slate-800">
              Transportation Needed?
            </Text>
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setArrivalPickup(!arrivalPickup)}
              className={`flex-1 flex-row items-center gap-3 p-3 bg-slate-50 rounded-md border-2 ${
                arrivalPickup ? "border-pink-200" : "border-transparent"
              }`}
            >
              {arrivalPickup ? (
                <CheckSquare size={20} color={PRIMARY} />
              ) : (
                <Square size={20} color="#cbd5e1" />
              )}
              <Text className="text-sm font-medium text-slate-900">
                Arrival Pickup
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDepartureDrop(!departureDrop)}
              className={`flex-1 flex-row items-center gap-3 p-3 bg-slate-50 rounded-md border-2 ${
                departureDrop ? "border-pink-200" : "border-transparent"
              }`}
            >
              {departureDrop ? (
                <CheckSquare size={20} color={PRIMARY} />
              ) : (
                <Square size={20} color="#cbd5e1" />
              )}
              <Text className="text-sm font-medium text-slate-900">
                Departure Drop
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Dietary Notes */}
      <View>
        <View className="flex-row items-center gap-2 mb-3">
          <Icon name="restaurant_menu" />
          <Text className="font-bold text-slate-800">Special Notes</Text>
        </View>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Dietary restrictions, allergies, or any other requests..."
          value={notes}
          onChangeText={setNotes}
          className="w-full bg-slate-50 rounded-md p-4 text-sm text-slate-900"
          placeholderTextColor="#94a3b8"
          textAlignVertical="top"
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        className="w-full py-4 rounded-md items-center justify-center mb-4"
        style={{ backgroundColor: PRIMARY }}
        activeOpacity={0.9}
        onPress={handleSubmit}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-base">Save RSVP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

/** Standalone full-page RSVP form (used at the /rsvp route) */
const RSVPForm = () => {
  const {
    userId,
    familyId,
    memberName,
    eventId,
    rawStatus,
    rawArrival,
    rawDeparture,
    rawAccommodation,
    rawNotes,
  } = useLocalSearchParams<{
    userId?: string;
    familyId?: string;
    memberName?: string;
    eventId?: string;
    rawStatus?: string;
    rawArrival?: string;
    rawDeparture?: string;
    rawAccommodation?: string;
    rawNotes?: string;
  }>();
  const { user } = useAuthStore();

  const resolvedUserId = userId ?? user?.id?.toString() ?? "";

  // Map backend status → attendance option
  const initialAttendance =
    rawStatus === "accepted"
      ? "yes"
      : rawStatus === "rejected"
        ? "no"
        : rawStatus === "maybe"
          ? "maybe"
          : "yes";

  const initialArrival = rawArrival ? new Date(rawArrival) : undefined;
  const initialDeparture = rawDeparture ? new Date(rawDeparture) : undefined;
  const initialAccommodation = rawAccommodation === "true";

  return (
    <View className="flex-1 max-w-md mx-auto w-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        {memberName && (
          <View
            className="mx-5 mt-4 mb-0 px-4 py-3 rounded-lg flex-row items-center gap-3"
            style={{
              backgroundColor: "#fdf2f8",
              borderWidth: 1,
              borderColor: "#f9a8d4",
            }}
          >
            <MaterialIcons name="person" size={18} className="!text-primary" />
            <Text className="text-sm font-semibold text-pink-700 flex-1">
              Filling RSVP for {memberName}
            </Text>
          </View>
        )}
        <RSVPFormContent
          userId={resolvedUserId}
          eventId={Number(eventId)}
          familyId={familyId ? Number(familyId) : undefined}
          memberName={memberName}
          initialAttendance={initialAttendance}
          initialAccommodation={initialAccommodation}
          initialArrival={initialArrival}
          initialDeparture={initialDeparture}
          initialNotes={rawNotes ?? ""}
        />
      </ScrollView>
    </View>
  );
};

export default RSVPForm;
