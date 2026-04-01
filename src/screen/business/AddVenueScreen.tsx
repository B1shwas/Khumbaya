import { BusinessCategory } from "@/src/constants/business";
import { useCreateVenue, useGetBusinessById, useUpdateBusinessVenue } from "@/src/features/business";
import { AddVenueFormState, CreateVenuePayload } from "@/src/features/business/types";
import { VENDOR_CATEGORIES } from "@/src/screen/business/business-form-constants";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const VENUE_SUBTYPES = (
  VENDOR_CATEGORIES.find((c) => c.value === BusinessCategory.Venue)?.subtypes ?? []
).map((s) => ({ label: s, value: s }));

const INITIAL_FORM: AddVenueFormState = {
  venue_type: "",
  is_outDoor: false,
  parking: false,
  capacity: "",
  area_sqft: "",
  min_booking_hours: "",
  max_booking_hours: "",
  price_per_hour: "",
};

function parseNum(s: string): number | undefined {
  const n = parseInt(s, 10);
  return isNaN(n) ? undefined : n;
}

function buildPayload(form: AddVenueFormState): CreateVenuePayload {
  return {
    venue_type: form.venue_type,
    is_outDoor: form.is_outDoor,
    parking: form.parking,
    capacity: parseNum(form.capacity),
    area_sqft: parseNum(form.area_sqft),
    min_booking_hours: parseNum(form.min_booking_hours),
    max_booking_hours: parseNum(form.max_booking_hours),
    price_per_hour: parseNum(form.price_per_hour),
  };
}

// ─── Reusable field components ────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-[11px] font-semibold text-[#594048] uppercase tracking-widest mb-2 mt-4">
      {title}
    </Text>
  );
}

function NumberField({
  label,
  icon,
  value,
  placeholder,
  unit,
  onChange,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
  placeholder: string;
  unit?: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="text-[11px] font-semibold text-[#594048] uppercase tracking-widest mb-1.5">
        {label}
      </Text>
      <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-12">
        <MaterialIcons name={icon} size={18} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-2 text-sm text-[#181114]"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
        />
        {unit && (
          <Text className="text-xs text-gray-400 ml-1">{unit}</Text>
        )}
      </View>
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-12 mb-3">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name={icon} size={18} color="#9ca3af" />
        <Text className="text-sm text-[#181114]">{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#e5e7eb", true: "#f9a8d4" }}
        thumbColor={value ? "#ee2b8c" : "#9ca3af"}
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AddVenueScreen() {
  const router = useRouter();
  const { businessId, venueId } = useLocalSearchParams<{ businessId: string; venueId?: string }>();
  const isEditMode = !!venueId;

  const [form, setForm] = useState<AddVenueFormState>(INITIAL_FORM);
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateBusinessVenue();

  // Pre-populate form in edit mode from cached business data
  const { data: businessWithAttribute } = useGetBusinessById(businessId ?? "");
  useEffect(() => {
    if (!isEditMode || !businessWithAttribute) return;
    const venue = businessWithAttribute.venue_information?.find(
      (v) => String(v.id) === venueId
    );
    if (!venue) return;
    setForm({
      venue_type: venue.venue_type ?? "",
      is_outDoor: venue.is_outDoor ?? false,
      parking: venue.parking ?? false,
      capacity: venue.capacity != null ? String(venue.capacity) : "",
      area_sqft: venue.area_sqft != null ? String(venue.area_sqft) : "",
      min_booking_hours: venue.min_booking_hours != null ? String(venue.min_booking_hours) : "",
      max_booking_hours: venue.max_booking_hours != null ? String(venue.max_booking_hours) : "",
      price_per_hour: venue.price_per_hour != null ? String(venue.price_per_hour) : "",
    });
  }, [isEditMode, venueId, businessWithAttribute]);

  const set = <K extends keyof AddVenueFormState>(key: K, value: AddVenueFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.venue_type) {
      Alert.alert("Required", "Please select a venue type.");
      return;
    }
    const minH = parseNum(form.min_booking_hours);
    const maxH = parseNum(form.max_booking_hours);
    if (minH !== undefined && maxH !== undefined && minH > maxH) {
      Alert.alert("Invalid", "Min booking hours cannot exceed max booking hours.");
      return;
    }

    if (isEditMode) {
      updateVenue.mutate(
        { venueId: Number(venueId), payload: buildPayload(form), businessId },
        {
          onSuccess: () => {
            Alert.alert("Success", "Venue updated successfully!", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
          onError: (err: any) => {
            Alert.alert("Error", err?.message ?? "Failed to update venue. Please try again.");
          },
        }
      );
    } else {
      createVenue.mutate(
        { businessId, payload: buildPayload(form) },
        {
          onSuccess: () => {
            Alert.alert("Success", "Venue added successfully!", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
          onError: (err: any) => {
            Alert.alert("Error", err?.message ?? "Failed to add venue. Please try again.");
          },
        }
      );
    }
  };

  const isPending = createVenue.isPending || updateVenue.isPending;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f8f6f7]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Required ── */}
        <SectionHeader title="Venue Details *" />

        <Text className="text-[11px] font-semibold text-[#594048] uppercase tracking-widest mb-1.5">
          Venue Type
        </Text>
        <Dropdown
          data={VENUE_SUBTYPES}
          labelField="label"
          valueField="value"
          placeholder="Select venue type"
          placeholderStyle={{ color: "#9ca3af", fontSize: 14 }}
          selectedTextStyle={{ color: "#181114", fontSize: 14 }}
          value={form.venue_type || null}
          onChange={(item) => set("venue_type", item.value)}
          style={{
            backgroundColor: "#fff",
            borderColor: form.venue_type ? "#ee2b8c" : "#e5e7eb",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
            marginBottom: 12,
          }}
          containerStyle={{ borderRadius: 12 }}
          activeColor="#fdf2f8"
        />

        <ToggleRow
          icon="wb-sunny"
          label="Outdoor Venue"
          value={form.is_outDoor}
          onChange={(v) => set("is_outDoor", v)}
        />
        <ToggleRow
          icon="local-parking"
          label="Parking Available"
          value={form.parking}
          onChange={(v) => set("parking", v)}
        />

        {/* ── Capacity & Size ── */}
        <NumberField
          label="Capacity (optional)"
          icon="people"
          value={form.capacity}
          placeholder="e.g. 500"
          unit="guests"
          onChange={(v) => set("capacity", v)}
        />
        <NumberField
          label="Area (optional)"
          icon="square-foot"
          value={form.area_sqft}
          placeholder="e.g. 4200"
          unit="sq ft"
          onChange={(v) => set("area_sqft", v)}
        />

        {/* ── Booking Hours ── */}
        <SectionHeader title="Booking Hours (optional)" />
        <NumberField
          label="Min Booking Hours"
          icon="schedule"
          value={form.min_booking_hours}
          placeholder="e.g. 4"
          unit="hrs"
          onChange={(v) => set("min_booking_hours", v)}
        />
        <NumberField
          label="Max Booking Hours"
          icon="schedule"
          value={form.max_booking_hours}
          placeholder="e.g. 12"
          unit="hrs"
          onChange={(v) => set("max_booking_hours", v)}
        />

        {/* ── Pricing ── */}
        <SectionHeader title="Pricing" />
        <NumberField
          label="Price Per Hour"
          icon="currency-rupee"
          value={form.price_per_hour}
          placeholder="e.g. 8000"
          unit="/ hr"
          onChange={(v) => set("price_per_hour", v)}
        />        
        

        {/* ── Submit ── */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isPending}
          activeOpacity={0.85}
          className="mt-6 bg-[#ee2b8c] rounded-2xl h-14 items-center justify-center"
          style={{ opacity: isPending ? 0.6 : 1 }}
        >
          <Text className="text-white text-base font-bold">
            {isPending
              ? isEditMode ? "Updating..." : "Adding..."
              : isEditMode ? "Update Venue" : "Add Venue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
