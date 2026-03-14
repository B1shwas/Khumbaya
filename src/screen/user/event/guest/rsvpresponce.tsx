import { DatePicker } from "@/components/nativewindui/DatePicker";
import { KeyboardAvoidingView, Platform } from "react-native";
import { KeyboardAwareScrollView, } from "react-native-keyboard-aware-scroll-view";
import { Text } from "@/src/components/ui/Text";
import { useSubmitRsvpResponse } from "@/src/features/events/hooks/use-event";
import { useAuthStore } from "@/src/store/AuthStore";
import { useRsvpStore } from "@/src/store/useRsvpStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckSquare, Square } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

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

export const RSVPFormContent = ({
  userId,
  eventId,
  familyId,
  initialAttendance = "yes",
  initialAccommodation = false,
  initialArrival,
  initialDeparture,
  initialNotes = "",
}: {
  userId: number;
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
  const clearDraft = useRsvpStore((s) => s.clearDraft);
  const { mutate: submitRsvp, isPending } = useSubmitRsvpResponse(eventId);

  const [attendance, setAttendance] = useState(initialAttendance);
  const [accommodation, setAccommodation] = useState(initialAccommodation);
  const [arrivalPickup, setArrivalPickup] = useState(false);
  const [departureDrop, setDepartureDrop] = useState(false);
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
        notes: notes.trim(),
        arrival_date_time: arrivalDateTime.toISOString(),
        departure_date_time: departureDateTime.toISOString(),
        isAccomodation: accommodation,
        status:
          attendance === "yes"
            ? "accepted"
            : attendance === "no"
              ? "rejected"
              : "maybe",
      },
      {
        onSuccess: () => {
          clearDraft();
          router.back();
        },
      }
    );
  };

  return (

    <View className="px-5 py-4 gap-8">
      {/* Attendance */}
      <View>
        <View className="flex-row items-center gap-2 mb-4">
          <Icon name="event_available" />
          <Text variant="h1" className="text-slate-800">
            Will you attend?
          </Text>
        </View>
        <View className="flex-row bg-pink-100 p-2 rounded-md">
          {["yes", "no", "maybe"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setAttendance(option)}
              className={`flex-1 py-2.5 rounded-sm ${attendance === option ? "bg-[#ee2b8c]" : ""
                }`}
              style={attendance === option ? { backgroundColor: PRIMARY } : {}}
            >
              <Text
                variant="h2"
                className={`text-center text-sm capitalize ${attendance === option ? "text-white" : "text-slate-600"
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
          <Text variant="h1" className="text-slate-800">
            Travel Itinerary
          </Text>
        </View>
        <View className="gap-4">
          <View>
            <Text
              variant="h2"
              className="text-xs uppercase tracking-wider text-slate-500 ml-1 mb-1.5"
            >
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
            <Text
              variant="h2"
              className="text-xs uppercase tracking-wider text-slate-500 ml-1 mb-1.5"
            >
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
              <Text variant="h1" className="text-sm text-slate-900">
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
            <Text variant="h1" className="text-slate-800">
              Transportation Needed?
            </Text>
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setArrivalPickup(!arrivalPickup)}
              className={`flex-1 flex-row items-center gap-3 p-3 bg-slate-50 rounded-md border-2 ${arrivalPickup ? "border-pink-200" : "border-transparent"
                }`}
            >
              {arrivalPickup ? (
                <CheckSquare size={20} color={PRIMARY} />
              ) : (
                <Square size={20} color="#cbd5e1" />
              )}
              <Text variant="h2" className="text-sm text-slate-900">
                Arrival Pickup
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDepartureDrop(!departureDrop)}
              className={`flex-1 flex-row items-center gap-3 p-3 bg-slate-50 rounded-md border-2 ${departureDrop ? "border-pink-200" : "border-transparent"
                }`}
            >
              {departureDrop ? (
                <CheckSquare size={20} color={PRIMARY} />
              ) : (
                <Square size={20} color="#cbd5e1" />
              )}
              <Text variant="h2" className="text-sm text-slate-900">
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
          <Text variant="h1" className="text-slate-800">
            Special Notes
          </Text>
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
          <Text variant="h1" className="text-white text-base">
            Save RSVP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const RSVPForm = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { user } = useAuthStore();
  const draft = useRsvpStore((s) => s.draft);

  const userId = Number(draft?.userId) ?? Number(user?.id);
  const familyId = draft?.familyId;
  const memberName = draft?.memberName;

  const initialAttendance =
    draft?.rawStatus === "accepted"
      ? "yes"
      : draft?.rawStatus === "rejected"
        ? "no"
        : draft?.rawStatus === "maybe"
          ? "maybe"
          : "yes";

  const initialArrival = draft?.rawArrival
    ? new Date(draft.rawArrival)
    : undefined;
  const initialDeparture = draft?.rawDeparture
    ? new Date(draft.rawDeparture)
    : undefined;
  const initialAccommodation = draft?.rawAccommodation === true;

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
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
        <ScrollView showsHorizontalScrollIndicator={false} >
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
              <Text variant="h2" className="text-sm text-pink-700 flex-1">
                Filling RSVP for {memberName}
              </Text>
            </View>
          )}
          <RSVPFormContent
            userId={userId}
            eventId={Number(eventId)}
            familyId={familyId}
            memberName={memberName}
            initialAttendance={initialAttendance}
            initialAccommodation={initialAccommodation}
            initialArrival={initialArrival}
            initialDeparture={initialDeparture}
            initialNotes={draft?.rawNotes ?? ""}
          />
        </ScrollView>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default RSVPForm;
