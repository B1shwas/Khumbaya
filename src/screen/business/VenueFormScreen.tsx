import { Text } from "@/src/components/ui/Text";
import { VenueAttribute } from "@/src/constants/business";
import { useGetBusinessById } from "@/src/features/business";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
  venue_type: string;
  capacity: string;
  area_sqft: string;
  price_per_hour: string;
  min_booking_hours: string;
  max_booking_hours: string;
  rooms_available: string;
  sound_limit_db: string;
  has_catering: boolean;
  has_av_equipment: boolean;
  is_outDoor: boolean;
  parking: boolean;
  valet_available: boolean;
  alcohol_allowed: boolean;
};

const EMPTY_FORM: VenueFormState = {
  venue_type: "",
  capacity: "",
  area_sqft: "",
  price_per_hour: "",
  min_booking_hours: "",
  max_booking_hours: "",
  rooms_available: "",
  sound_limit_db: "",
  has_catering: false,
  has_av_equipment: false,
  is_outDoor: false,
  parking: false,
  valet_available: false,
  alcohol_allowed: false,
};

function toFormValue(value: number | null) {
  return value == null ? "" : String(value);
}

function mapVenueToForm(venue: VenueAttribute): VenueFormState {
  return {
    venue_type: venue.venue_type ?? "",
    capacity: toFormValue(venue.capacity),
    area_sqft: toFormValue(venue.area_sqft),
    price_per_hour: toFormValue(venue.price_per_hour),
    min_booking_hours: toFormValue(venue.min_booking_hours),
    max_booking_hours: toFormValue(venue.max_booking_hours),
    rooms_available: toFormValue(venue.rooms_available),
    sound_limit_db: toFormValue(venue.sound_limit_db),
    has_catering: venue.has_catering,
    has_av_equipment: venue.has_av_equipment,
    is_outDoor: venue.is_outDoor,
    parking: venue.parking,
    valet_available: venue.valet_available,
    alcohol_allowed: venue.alcohol_allowed,
  };
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
      <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
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
    <View className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <View className="flex-row items-center gap-3 flex-1 mr-3">
        <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
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
  const [form, setForm] = useState<VenueFormState>(EMPTY_FORM);
  const [initialized, setInitialized] = useState(false);

  const editingVenue = useMemo(() => {
    if (!isEditMode || !businessWithAttribute?.venue_information || !venueId) return null;
    return (
      businessWithAttribute.venue_information.find((v) => String(v.id) === String(venueId)) ??
      null
    );
  }, [businessWithAttribute?.venue_information, isEditMode, venueId]);

  useEffect(() => {
    if (initialized) return;
    if (isEditMode) {
      if (!editingVenue) return;
      setForm(mapVenueToForm(editingVenue));
      setInitialized(true);
      return;
    }
    setForm(EMPTY_FORM);
    setInitialized(true);
  }, [initialized, isEditMode, editingVenue]);

  const setField = <K extends keyof VenueFormState>(key: K, value: VenueFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.venue_type) {
      Alert.alert("Required", "Please select a venue type.");
      return;
    }

    Alert.alert(
      "UI Ready ✅",
      isEditMode
        ? "Venue edit UI is ready. API integration can be connected next."
        : "Venue create UI is ready. API integration can be connected next.",
      [{ text: "Awesome", onPress: () => router.back() }]
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
              <MaterialIcons name="meeting-room" size={20} color="#ee2b8c" />
            </View>
            <View className="flex-1">
              <Text variant="h1" className="text-[#181114] text-base">
                {isEditMode ? "Edit Venue" : "Add New Venue"}
              </Text>
              <Text className="text-xs text-[#594048] mt-0.5">
                {isEditMode
                  ? "Update complete venue details, pricing and amenities."
                  : "Quick add with core fields only. You can complete the rest later from edit."}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-5">
          <View>
            <Text
              variant="h1"
              className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5"
            >
              Venue Type
            </Text>
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
              value={form.venue_type || null}
              onChange={(item) => setField("venue_type", item.value)}
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
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <NumberInput
                label="Capacity"
                icon="groups"
                placeholder="e.g. 300"
                value={form.capacity}
                onChange={(value) => setField("capacity", value)}
                suffix="guests"
              />
            </View>
            <View className="flex-1">
              <NumberInput
                label="Price Per Hour"
                icon="payments"
                placeholder="e.g. 8000"
                value={form.price_per_hour}
                onChange={(value) => setField("price_per_hour", value)}
                suffix="NPR"
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
                  <ToggleItem
                    label="Catering Available"
                    icon="restaurant"
                    value={form.has_catering}
                    onValueChange={(value) => setField("has_catering", value)}
                  />
                  <ToggleItem
                    label="Outdoor Venue"
                    icon="wb-sunny"
                    value={form.is_outDoor}
                    onValueChange={(value) => setField("is_outDoor", value)}
                  />
                  <ToggleItem
                    label="Parking"
                    icon="local-parking"
                    value={form.parking}
                    onValueChange={(value) => setField("parking", value)}
                  />
                </View>
              </View>

              <View className="bg-white border border-primary/20 rounded-2xl p-3.5 flex-row gap-2">
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
                  <NumberInput
                    label="Area"
                    icon="straighten"
                    placeholder="e.g. 5000"
                    value={form.area_sqft}
                    onChange={(value) => setField("area_sqft", value)}
                    suffix="sqft"
                  />
                </View>
                <View className="flex-1">
                  <NumberInput
                    label="Rooms Available"
                    icon="hotel"
                    placeholder="e.g. 6"
                    value={form.rooms_available}
                    onChange={(value) => setField("rooms_available", value)}
                    suffix="rooms"
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <NumberInput
                    label="Min Booking Hours"
                    icon="schedule"
                    placeholder="e.g. 4"
                    value={form.min_booking_hours}
                    onChange={(value) => setField("min_booking_hours", value)}
                    suffix="hours"
                  />
                </View>
                <View className="flex-1">
                  <NumberInput
                    label="Max Booking Hours"
                    icon="timer"
                    placeholder="e.g. 24"
                    value={form.max_booking_hours}
                    onChange={(value) => setField("max_booking_hours", value)}
                    suffix="hours"
                  />
                </View>
              </View>

              <NumberInput
                label="Sound Limit"
                icon="volume-up"
                placeholder="e.g. 85"
                value={form.sound_limit_db}
                onChange={(value) => setField("sound_limit_db", value)}
                suffix="dB"
              />

              <View className="mt-1">
                <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-2">
                  Amenities
                </Text>
                <View className="gap-2.5">
                  <ToggleItem
                    label="Catering Available"
                    icon="restaurant"
                    value={form.has_catering}
                    onValueChange={(value) => setField("has_catering", value)}
                  />
                  <ToggleItem
                    label="AV Equipment"
                    icon="tv"
                    value={form.has_av_equipment}
                    onValueChange={(value) => setField("has_av_equipment", value)}
                  />
                  <ToggleItem
                    label="Outdoor Venue"
                    icon="wb-sunny"
                    value={form.is_outDoor}
                    onValueChange={(value) => setField("is_outDoor", value)}
                  />
                  <ToggleItem
                    label="Parking"
                    icon="local-parking"
                    value={form.parking}
                    onValueChange={(value) => setField("parking", value)}
                  />
                  <ToggleItem
                    label="Valet Service"
                    icon="directions-car"
                    value={form.valet_available}
                    onValueChange={(value) => setField("valet_available", value)}
                  />
                  <ToggleItem
                    label="Alcohol Allowed"
                    icon="local-bar"
                    value={form.alcohol_allowed}
                    onValueChange={(value) => setField("alcohol_allowed", value)}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="px-5 pb-4 bg-[#f8f6f7]/95">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          className="w-full bg-[#ee2b8c] rounded-2xl py-5 flex-row items-center justify-center gap-3"
          style={{
            shadowColor: "#ee2b8c",
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Text className="text-white font-extrabold text-[17px] tracking-tight">
            {isEditMode ? "Save Venue Changes" : "Create Venue"}
          </Text>
          <MaterialIcons
            name={isEditMode ? "check" : "arrow-forward"}
            size={21}
            color="white"
          />
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}