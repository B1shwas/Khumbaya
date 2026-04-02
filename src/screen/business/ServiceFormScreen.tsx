import { Text } from "@/src/components/ui/Text";
import { OtherServiceAttribute } from "@/src/constants/business";
import {
    useGetBusinessById,
    useUpdateBusinessService,
} from "@/src/features/business";
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
import { SafeAreaView } from "react-native-safe-area-context";

type ServiceFormState = {
  artist_type: string;
  styles_specialized: string;
  max_bookings_per_day: string;
  advance_amount: string;
  travel_charges: string;
  min_order: string;
  portfolio_link: string;
  uses_own_material: boolean;
  available_for_destination: boolean;
  customization_available: boolean;
  serves_veg: boolean;
};

const EMPTY_FORM: ServiceFormState = {
  artist_type: "",
  styles_specialized: "",
  max_bookings_per_day: "",
  advance_amount: "",
  travel_charges: "",
  min_order: "",
  portfolio_link: "",
  uses_own_material: false,
  available_for_destination: false,
  customization_available: false,
  serves_veg: false,
};

function toFormValue(value: number | null) {
  return value == null ? "" : String(value);
}

function toNullableNumber(value: string): number | null | undefined {
  const normalized = value.trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function mapServiceToForm(service: OtherServiceAttribute): ServiceFormState {
  return {
    artist_type: service.artist_type ?? "",
    styles_specialized: service.styles_specialized ?? "",
    max_bookings_per_day: toFormValue(service.max_bookings_per_day),
    advance_amount: toFormValue(service.advance_amount),
    travel_charges: toFormValue(service.travel_charges),
    min_order: toFormValue(service.min_order),
    portfolio_link: service.portfolio_link ?? "",
    uses_own_material: service.uses_own_material,
    available_for_destination: service.available_for_destination,
    customization_available: service.customization_available,
    serves_veg: service.serves_veg,
  };
}

function TextField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  keyboardType,
  suffix,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "url";
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
          keyboardType={keyboardType ?? "default"}
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
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

export default function ServiceFormScreen() {
  const router = useRouter();
  const { businessId, serviceId, mode } = useLocalSearchParams<{
    businessId: string;
    serviceId?: string;
    mode?: "edit";
  }>();

  const isEditMode = !!serviceId || mode === "edit";
  const { data: businessWithAttribute, isLoading } = useGetBusinessById(
    businessId ?? ""
  );
  const updateBusinessService = useUpdateBusinessService();

  const { control, handleSubmit, reset } = useForm<ServiceFormState>({
    defaultValues: EMPTY_FORM,
  });

  const editingService = useMemo(() => {
    if (!isEditMode || !businessWithAttribute?.vendor_services_information || !serviceId) {
      return null;
    }

    return (
      businessWithAttribute.vendor_services_information.find(
        (service) => String(service.id) === String(serviceId)
      ) ?? null
    );
  }, [businessWithAttribute?.vendor_services_information, isEditMode, serviceId]);

  useEffect(() => {
    if (isEditMode) {
      if (!editingService) return;
      reset(mapServiceToForm(editingService));
      return;
    }

    reset(EMPTY_FORM);
  }, [editingService, isEditMode, reset]);

  const onSubmit = (form: ServiceFormState) => {
    if (!isEditMode) {
      Alert.alert("UI Ready ✅", "Service create API integration can be connected next.", [
        { text: "Awesome", onPress: () => router.back() },
      ]);
      return;
    }

    if (!serviceId) {
      Alert.alert("Error", "Service id is missing.");
      return;
    }

    updateBusinessService.mutate(
      {
        serviceId,
        businessId,
        payload: {
          artist_type: form.artist_type.trim() || undefined,
          styles_specialized: form.styles_specialized.trim() || undefined,
          max_bookings_per_day: toNullableNumber(form.max_bookings_per_day),
          advance_amount: toNullableNumber(form.advance_amount),
          travel_charges: toNullableNumber(form.travel_charges),
          min_order: toNullableNumber(form.min_order),
          portfolio_link: form.portfolio_link.trim() || undefined,
          uses_own_material: form.uses_own_material,
          available_for_destination: form.available_for_destination,
          customization_available: form.customization_available,
          serves_veg: form.serves_veg,
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Service updated successfully.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert("Error", "Failed to update service. Please try again.");
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

  if (isEditMode && !editingService) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center px-8">
        <MaterialIcons name="miscellaneous-services" size={48} color="#d1d5db" />
        <Text variant="h2" className="text-[#594048] mt-3 text-base text-center">
          Service not found for editing
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
              <MaterialIcons name="miscellaneous-services" size={20} color="#ee2b8c" />
            </View>
            <View className="flex-1">
              <Text variant="h1" className="text-[#181114] text-base">
                {isEditMode ? "Edit Service" : "Add New Service"}
              </Text>
              <Text className="text-xs text-[#594048] mt-0.5">
                Update service details, pricing and feature flags.
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-5">
          <Controller
            control={control}
            name="artist_type"
            render={({ field: { value, onChange } }) => (
              <TextField
                label="Artist Type"
                icon="person"
                placeholder="e.g. Bridal Makeup Artist"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="styles_specialized"
            render={({ field: { value, onChange } }) => (
              <TextField
                label="Styles Specialized"
                icon="palette"
                placeholder="e.g. Bridal, Editorial"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="max_bookings_per_day"
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label="Max Bookings / Day"
                    icon="event-available"
                    placeholder="e.g. 3"
                    keyboardType="numeric"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="advance_amount"
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label="Advance Amount"
                    icon="payments"
                    placeholder="e.g. 5000"
                    keyboardType="numeric"
                    suffix="NPR"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="travel_charges"
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label="Travel Charges"
                    icon="flight-takeoff"
                    placeholder="e.g. 1500"
                    keyboardType="numeric"
                    suffix="NPR"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="min_order"
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label="Minimum Order"
                    icon="shopping-bag"
                    placeholder="e.g. 10000"
                    keyboardType="numeric"
                    suffix="NPR"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="portfolio_link"
            render={({ field: { value, onChange } }) => (
              <TextField
                label="Portfolio Link"
                icon="link"
                placeholder="https://..."
                keyboardType="url"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <View className="mt-1">
            <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-2">
              Service Flags
            </Text>
            <View className="gap-2.5">
              <Controller
                control={control}
                name="uses_own_material"
                render={({ field: { value, onChange } }) => (
                  <ToggleItem
                    label="Uses Own Material"
                    icon="inventory"
                    value={value}
                    onValueChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="available_for_destination"
                render={({ field: { value, onChange } }) => (
                  <ToggleItem
                    label="Available for Destination"
                    icon="travel-explore"
                    value={value}
                    onValueChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="customization_available"
                render={({ field: { value, onChange } }) => (
                  <ToggleItem
                    label="Customization Available"
                    icon="tune"
                    value={value}
                    onValueChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="serves_veg"
                render={({ field: { value, onChange } }) => (
                  <ToggleItem
                    label="Serves Veg"
                    icon="eco"
                    value={value}
                    onValueChange={onChange}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-4">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit(onSubmit)}
          disabled={updateBusinessService.isPending}
          className="w-full bg-[#ee2b8c] rounded-md py-5 flex-row items-center justify-center gap-3"
          style={{
            shadowColor: "#ee2b8c",
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
            opacity: updateBusinessService.isPending ? 0.7 : 1,
          }}
        >
          <Text className="text-white font-extrabold text-[17px] tracking-tight">
            {updateBusinessService.isPending ? "Saving..." : "Save Service Changes"}
          </Text>
          {!updateBusinessService.isPending && (
            <MaterialIcons name="check" size={21} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
