import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimeRangePicker } from "../../components/ui/DateTimeRangePicker";
import { useCreateCateringMutation } from "../../features/catering";
import { cn } from "../../utils/cn";

// ─── Types & Constants ────────────────────────────────────────────────────────

interface CateringFormData {
  name: string;
  mealType: string;
  perPlatePrice: string;
  startDateTime: Date;
  endDateTime: Date;
}

const MEAL_TYPE_OPTIONS = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "High Tea", value: "High Tea" },
  { label: "Dinner", value: "Dinner" },
  { label: "Late Night", value: "Late Night" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FormSection = ({
  title,
  subtitle,
  children,
  icon,
  iconColor = "#ee2b8c",
  iconBg = "bg-primary/10",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconBg?: string;
}) => (
  <View className="mb-3 mt-2">
    <View className="flex-row items-center mb-5 px-1">
      <View
        className={cn(
          "w-10 h-10 rounded-xl items-center justify-center mr-3",
          iconBg
        )}
      >
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View>
        <Text className="text-lg font-bold text-[#181114] tracking-tight">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-xs font-medium text-gray-500">{subtitle}</Text>
        )}
      </View>
    </View>
    <View className="px-1">{children}</View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CreateCateringScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = parseInt(params.eventId as string, 10);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CateringFormData>({
    defaultValues: {
      name: "",
      mealType: "Lunch",
      perPlatePrice: "",
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 3600000),
    },
  });

  const navigation = useNavigation();
  const createCateringMutation = useCreateCateringMutation(eventId);

  const startDateTime = watch("startDateTime");
  const endDateTime = watch("endDateTime");

  const onSubmit = async (data: CateringFormData) => {
    try {
      if (data.endDateTime <= data.startDateTime) {
        Alert.alert("Error", "End time must be after start time");
        return;
      }

      await createCateringMutation.mutateAsync({
        name: data.name,
        per_plate_price: data.perPlatePrice,
        startDateTime: data.startDateTime.toISOString(),
        endDateTime: data.endDateTime.toISOString(),
        meal_type: data.mealType,
      });

      Alert.alert("Success", "Catering plan created successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create catering plan";
      Alert.alert("Error", errorMessage);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={createCateringMutation.isPending}
          style={{
            backgroundColor: "#ee2b8c",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            marginRight: 12,
            opacity: createCateringMutation.isPending ? 0.6 : 1,
          }}
        >
          <Text className="text-white font-bold text-[15px]">
            {createCateringMutation.isPending ? "Creating..." : "Create"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit, onSubmit, createCateringMutation.isPending]);

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]" edges={["bottom"]}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={120}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-4 py-4">
          {/* Plan Details */}
          <FormSection
            title="Plan Details"
            subtitle="Name and meal configuration"
            icon="restaurant-menu"
          >
            <View className="mb-5">
              <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Plan Name
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Plan name is required",
                  maxLength: {
                    value: 255,
                    message: "Name must be less than 255 characters",
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <TextInput
                      placeholder="e.g., Wedding Reception Dinner"
                      placeholderTextColor="#9CA3AF"
                      className="h-14 rounded-md border border-gray-200 bg-white px-4 text-base text-[#181114]"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.name && (
                      <Text className="mt-1 ml-1 text-xs text-red-500">
                        {errors.name.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View className="mb-5">
              <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Meal Type
              </Text>
              <Controller
                control={control}
                name="mealType"
                rules={{ required: "Meal type is required" }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <Dropdown
                      style={{
                        height: 56,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 6,
                        paddingHorizontal: 16,
                        backgroundColor: "#ffffff",
                      }}
                      data={MEAL_TYPE_OPTIONS}
                      labelField="label"
                      valueField="value"
                      placeholder="Select meal type"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                      selectedTextStyle={{
                        color: "#ee2b8c",
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                      placeholderStyle={{ color: "#9CA3AF", fontSize: 15 }}
                      itemTextStyle={{ color: "#181114", fontSize: 15 }}
                      activeColor="#fdf2f8"
                      renderItem={(item) => (
                        <View className="flex-row items-center justify-between px-4 py-3">
                          <Text className="text-[15px] font-medium text-[#181114]">
                            {item.label}
                          </Text>
                          {value === item.value && (
                            <MaterialIcons
                              name="check"
                              size={18}
                              color="#ee2b8c"
                            />
                          )}
                        </View>
                      )}
                    />
                    {errors.mealType && (
                      <Text className="mt-1 ml-1 text-xs text-red-500">
                        {errors.mealType.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
          </FormSection>

          {/* Pricing */}
          <FormSection
            title="Pricing"
            subtitle="Per guest cost estimate"
            icon="payments"
            iconColor="#a23665"
            iconBg="bg-secondary-container/20"
          >
            <View className="mb-5">
              <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Per Plate Price
              </Text>
              <Controller
                control={control}
                name="perPlatePrice"
                rules={{
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Invalid price format (e.g., 50 or 50.99)",
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <View className="h-14 flex-row items-center rounded-md border border-gray-200 bg-white px-4">
                      <MaterialIcons
                        name="attach-money"
                        size={20}
                        color="#9CA3AF"
                      />
                      <TextInput
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-1 text-base text-[#181114]"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    {errors.perPlatePrice && (
                      <Text className="mt-1 ml-1 text-xs text-red-500">
                        {errors.perPlatePrice.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
          </FormSection>

          {/* Service Window */}
          <FormSection
            title="Service Window"
            subtitle="Meal start and end time"
            icon="schedule"
            iconColor="#046c00"
            iconBg="bg-tertiary-container"
          >
            <DateTimeRangePicker
              value={{
                startDateTime,
                endDateTime,
              }}
              onChange={({ startDateTime: start, endDateTime: end }) => {
                setValue("startDateTime", start, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setValue("endDateTime", end, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              startLabel="Start"
              endLabel="End"
            />
            {errors.endDateTime && (
              <Text className="mt-2 ml-1 text-xs text-red-500">
                {errors.endDateTime.message}
              </Text>
            )}
          </FormSection>

          {/* Bottom CTA */}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
