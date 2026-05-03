import { Text } from "@/src/components/ui/Text";
import {
  useCreateBusinessVenue,
  useGetBusinessById,
  useUpdateBusinessVenue,
} from "@/src/features/business";
import { VenueAttribute } from "@/src/features/business/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

const VENUE_TYPE_OPTIONS = [
  "Banquet Hall",
  "Marriage Garden / Lawns",
  "Wedding Resorts",
  "Small Function / Party Hall",
  "Destination Wedding Venue",
  "Kalyana Mandapam",
  "4 Star & Above Wedding Hotel",
  "Wedding Farmhouse",
].map((label) => ({ label, value: label }));

type VenueFormState = {
  venueName: string;
  venueType: string;
  capacity: string;
  areaSqft: string;
  pricePerhour: string;
  minBookinghours: string;
  maxBookinghours: string;
  roomsAvailable: string;
  soundLimitdb: string;
  hasCatering: boolean;
  hasAvequipment: boolean;
  isOutDoor: boolean;
  parking: boolean;
  valetAvailable: boolean;
  alcoholAllowed: boolean;
};

const EMPTY_FORM: VenueFormState = {
  venueName: "",
  venueType: "",
  capacity: "",
  areaSqft: "",
  pricePerhour: "",
  minBookinghours: "",
  maxBookinghours: "",
  roomsAvailable: "",
  soundLimitdb: "",
  hasCatering: false,
  hasAvequipment: false,
  isOutDoor: false,
  parking: false,
  valetAvailable: false,
  alcoholAllowed: false,
};

function toFormValue(value: number | null) {
  return value == null ? "" : String(value);
}

function mapVenueToForm(venue: VenueAttribute): VenueFormState {
  return {
    venueName: venue.venueName ?? "",
    venueType: venue.venueType ?? "",
    capacity: toFormValue(venue.capacity),
    areaSqft: toFormValue(venue.areaSqft),
    pricePerhour: toFormValue(venue.pricePerhour),
    minBookinghours: toFormValue(venue.minBookinghours),
    maxBookinghours: toFormValue(venue.maxBookinghours),
    roomsAvailable: toFormValue(venue.roomsAvailable),
    soundLimitdb: toFormValue(venue.soundLimitdb),
    hasCatering: venue.hasCatering,
    hasAvequipment: venue.hasAvequipment,
    isOutDoor: venue.isOutDoor,
    parking: venue.parking,
    valetAvailable: venue.valetAvailable,
    alcoholAllowed: venue.alcoholAllowed,
  };
}

function toNullableNumber(value: string): number | null | undefined {
  const normalized = value.trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function NumberInput({
  label,
  icon,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix?: string;
}) {
  return (
    <View>
      <Text
        variant="h1"
        className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5"
      >
        {label}
      </Text>
      <View className="flex-row items-center bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
        <MaterialIcons
          name={icon}
          size={18}
          color="#9ca3af"
          style={{ marginLeft: 14 }}
        />
        <TextInput
          className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
          placeholder={placeholder}
          placeholderTextColor="#d1d5db"
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
        />
        {!!suffix && <Text className="text-gray-400 text-[13px] pr-4">{suffix}</Text>}
      </View>
    </View>
  );
}

function ToggleItem({
  label,
  icon,
  value,
  onValueChange,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between bg-white border border-gray-100 rounded-md px-4 py-3 shadow-sm">
      <View className="flex-row items-center gap-3 flex-1 mr-3">
        <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
          <MaterialIcons name={icon} size={16} color="#ee2b8c" />
        </View>
        <Text className="text-[#181114] text-sm font-medium flex-1">{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e5e7eb", true: "#ee2b8c" }}
        thumbColor="white"
      />
    </View>
  );
}

export default function VenueFormScreen() {
  const router = useRouter();
  const { businessId, venueId, mode } = useLocalSearchParams<{
    businessId: string;
    venueId?: string;
    mode?: "create" | "edit";
  }>();

  const isEditMode = !!venueId || mode === "edit";
  const isCreateMode = !isEditMode;
  const { data: businessWithAttribute, isLoading } = useGetBusinessById(businessId ?? "");
  const createBusinessVenue = useCreateBusinessVenue();
  const updateBusinessVenue = useUpdateBusinessVenue();
  const isSubmitting = createBusinessVenue.isPending || updateBusinessVenue.isPending;
  const { control, handleSubmit, reset } = useForm<VenueFormState>({
    defaultValues: EMPTY_FORM,
  });

  const editingVenue = useMemo(() => {
    if (!isEditMode || !businessWithAttribute?.venueInformation || !venueId) return null;
    return (
      businessWithAttribute.venueInformation.find((v) => String(v.venueId) === String(venueId)) ??
      null
    );
  }, [businessWithAttribute?.venueInformation, isEditMode, venueId]);

  useEffect(() => {
    if (isEditMode) {
      if (!editingVenue) return;
      reset(mapVenueToForm(editingVenue));
      return;
    }
    reset(EMPTY_FORM);
  }, [isEditMode, editingVenue, reset]);

  const onSubmit = (form: VenueFormState) => {
    if (!form.venueType && !isEditMode) {
      Alert.alert("Required", "Please select a venue type.");
      return;
    }

    const venuePayload = {
      venueName: form.venueName || undefined,
      venueType: form.venueType,
      capacity: toNullableNumber(form.capacity),
      areaSqft: toNullableNumber(form.areaSqft),
      pricePerhour: toNullableNumber(form.pricePerhour),
      minBookinghours: toNullableNumber(form.minBookinghours),
      maxBookinghours: toNullableNumber(form.maxBookinghours),
      roomsAvailable: toNullableNumber(form.roomsAvailable),
      soundLimitdb: toNullableNumber(form.soundLimitdb),
      hasCatering: form.hasCatering,
      hasAvequipment: form.hasAvequipment,
      isOutDoor: form.isOutDoor,
      parking: form.parking,
      valetAvailable: form.valetAvailable,
      alcoholAllowed: form.alcoholAllowed,
    };

    if (isEditMode) {
      if (!venueId) {
        Alert.alert("Error", "Venue id is missing.");
        return;
      }

      updateBusinessVenue.mutate(
        {
          venueId: String(venueId),
          businessId,
          payload: venuePayload,
        },
        {
          onSuccess: () => {
            Alert.alert("Success", "Venue updated successfully.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
          onError: () => {
            Alert.alert("Error", "Failed to update venue. Please try again.");
          },
        }
      );
      return;
    }

    if (!businessId) {
      Alert.alert("Error", "Business id is missing.");
      return;
    }

    createBusinessVenue.mutate(
      {
        businessId: String(businessId),
        ...venuePayload,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Venue created successfully.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert("Error", "Failed to create venue. Please try again.");
        },
      }
    );
  };

  if (isLoading && isEditMode) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center">
        <ActivityIndicator color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  if (isEditMode && !editingVenue) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center px-8">
        <MaterialIcons name="meeting-room" size={48} color="#d1d5db" />
        <Text variant="h2" className="text-[#594048] mt-3 text-base text-center">
          Venue not found for editing
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      className="flex-1 bg-[#f8f6f7]"
    >
      <SafeAreaView edges={["top"]} className="bg-[#f8f6f7]">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="p-1">
            <MaterialIcons name="arrow-back" size={24} color="#181114" />
          </TouchableOpacity>
          <Text variant="h1" className="text-[#181114] text-base">
            {isEditMode ? "Edit Venue" : "Add New Venue"}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-[#ee2b8c] rounded-lg px-4 py-2"
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            <Text className="text-white font-bold text-sm">
              {isSubmitting ? "Saving..." : isEditMode ? "Save" : "Create"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-5">
          <View>
            <Text
              variant="h1"
              className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5"
            >
              Venue Name
            </Text>
            <Controller
              control={control}
              name="venueName"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row items-center bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
                  <MaterialIcons
                    name="store"
                    size={18}
                    color="#9ca3af"
                    style={{ marginLeft: 14 }}
                  />
                  <TextInput
                    className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
                    placeholder="e.g. The Grand Ballroom"
                    placeholderTextColor="#d1d5db"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
          </View>

          <View>
            <Text
              variant="h1"
              className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5"
            >
              Venue Type
            </Text>
            <Controller
              control={control}
              name="venueType"
              render={({ field: { value, onChange } }) => (
                <Dropdown
                  style={{
                    height: 50,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    backgroundColor: "white",
                  }}
                  placeholderStyle={{ color: "#d1d5db", fontSize: 15 }}
                  selectedTextStyle={{ color: "#181114", fontSize: 15, fontWeight: "600" }}
                  data={VENUE_TYPE_OPTIONS}
                  labelField="label"
                  valueField="value"
                  placeholder="Select venue type"
                  value={value || null}
                  onChange={(item) => onChange(item.value)}
                  renderItem={(item, selected) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        backgroundColor: selected ? "#fdf2f8" : "white",
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 15,
                          color: selected ? "#ee2b8c" : "#181114",
                          fontWeight: selected ? "600" : "400",
                        }}
                      >
                        {item.label}
                      </Text>
                      {selected && (
                        <MaterialIcons name="check-circle" size={16} color="#ee2b8c" />
                      )}
                    </View>
                  )}
                />
              )}
            />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="capacity"
                render={({ field: { value, onChange } }) => (
                  <NumberInput
                    label="Capacity"
                    icon="groups"
                    placeholder="e.g. 300"
                    value={value}
                    onChange={onChange}
                    suffix="guests"
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="pricePerhour"
                render={({ field: { value, onChange } }) => (
                  <NumberInput
                    label="Price Per Hour"
                    icon="payments"
                    placeholder="e.g. 8000"
                    value={value}
                    onChange={onChange}
                    suffix="NPR"
                  />
                )}
              />
            </View>
          </View>

          {isCreateMode ? (
            <>
              <View className="mt-1">
                <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-2">
                  Quick Amenities
                </Text>
                <View className="gap-2.5">
                  <Controller
                    control={control}
                    name="hasCatering"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Catering Available"
                        icon="restaurant"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="isOutDoor"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Outdoor Venue"
                        icon="wb-sunny"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="parking"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Parking"
                        icon="local-parking"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="bg-white border border-primary/20 rounded-md p-3.5 flex-row gap-2">
                <MaterialIcons name="auto-awesome" size={16} color="#ee2b8c" />
                <Text className="text-xs text-[#594048] flex-1 leading-5">
                  Pro tip: after creating, open Edit Venue to add advanced details like booking window,
                  rooms, AV, valet and sound limit.
                </Text>
              </View>
            </>
          ) : (
            <>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="areaSqft"
                    render={({ field: { value, onChange } }) => (
                      <NumberInput
                        label="Area"
                        icon="straighten"
                        placeholder="e.g. 5000"
                        value={value}
                        onChange={onChange}
                        suffix="sqft"
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="roomsAvailable"
                    render={({ field: { value, onChange } }) => (
                      <NumberInput
                        label="Rooms Available"
                        icon="hotel"
                        placeholder="e.g. 6"
                        value={value}
                        onChange={onChange}
                        suffix="rooms"
                      />
                    )}
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="minBookinghours"
                    render={({ field: { value, onChange } }) => (
                      <NumberInput
                        label="Min Booking Hours"
                        icon="schedule"
                        placeholder="e.g. 4"
                        value={value}
                        onChange={onChange}
                        suffix="hours"
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="maxBookinghours"
                    render={({ field: { value, onChange } }) => (
                      <NumberInput
                        label="Max Booking Hours"
                        icon="timer"
                        placeholder="e.g. 24"
                        value={value}
                        onChange={onChange}
                        suffix="hours"
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="soundLimitdb"
                render={({ field: { value, onChange } }) => (
                  <NumberInput
                    label="Sound Limit"
                    icon="volume-up"
                    placeholder="e.g. 85"
                    value={value}
                    onChange={onChange}
                    suffix="dB"
                  />
                )}
              />

              <View className="mt-1">
                <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-2">
                  Amenities
                </Text>
                <View className="gap-2.5">
                  <Controller
                    control={control}
                    name="hasCatering"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Catering Available"
                        icon="restaurant"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="hasAvequipment"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="AV Equipment"
                        icon="tv"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="isOutDoor"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Outdoor Venue"
                        icon="wb-sunny"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="parking"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Parking"
                        icon="local-parking"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="valetAvailable"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Valet Service"
                        icon="directions-car"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="alcoholAllowed"
                    render={({ field: { value, onChange } }) => (
                      <ToggleItem
                        label="Alcohol Allowed"
                        icon="local-bar"
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
