import { DatePicker } from "@/components/nativewindui/DatePicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/Text";
import { useCreateCateringMutation } from "../../features/catering";
import { shadowStyle } from "../../utils/helper";

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

export default function CreateCateringScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = parseInt(params.eventId as string, 10);

  // Form hook
  const {
    control,
    handleSubmit,
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

  // API mutation
  const createCateringMutation = useCreateCateringMutation(eventId);

  const onSubmit = async (data: CateringFormData) => {
    try {
      // Validate dates
      if (data.endDateTime <= data.startDateTime) {
        Alert.alert("Error", "End time must be after start time");
        return;
      }

      await createCateringMutation.mutateAsync({
        name: data.name,
        perPlateprice: data.perPlatePrice,
        startDateTime: data.startDateTime.toISOString(),
        endDateTime: data.endDateTime.toISOString(),
        mealType: data.mealType,
      });

      Alert.alert("Success", "Catering plan created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create catering plan";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background-light"
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Form Content */}
          <View className="px-6 py-6">
            {/* Plan Name */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
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
                  <View>
                    <TextInput
                      placeholder="e.g., Wedding Reception Dinner"
                      placeholderTextColor="#896175"
                      className="bg-background-light border border-outline-variant/50 rounded-lg px-4 py-3 text-base font-medium text-on-surface"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.name && (
                      <Text className="text-red-500 text-xs mt-2">
                        {errors.name.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Meal Type Dropdown */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Meal Type
              </Text>
              <Controller
                control={control}
                name="mealType"
                rules={{ required: "Meal type is required" }}
                render={({ field: { value, onChange } }) => (
                  <View>
                    <Dropdown
                      style={{
                        height: 50,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        backgroundColor: "#fafbfc",
                      }}
                      data={MEAL_TYPE_OPTIONS}
                      labelField="label"
                      valueField="value"
                      placeholder="Select meal type"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                      selectedTextStyle={{
                        color: "#ee2b8c",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                      placeholderStyle={{ color: "#896175", fontSize: 16 }}
                      itemTextStyle={{ color: "#1a1a1a", fontSize: 16 }}
                      activeColor="#fdf2f8"
                      renderItem={(item) => (
                        <View className="flex-row items-center justify-between px-4 py-3">
                          <Text className="text-base font-medium text-on-surface">
                            {item.label}
                          </Text>
                          {value === item.value && (
                            <MaterialIcons
                              name="check"
                              size={20}
                              color="#ee2b8c"
                            />
                          )}
                        </View>
                      )}
                    />
                    {errors.mealType && (
                      <Text className="text-red-500 text-xs mt-2">
                        {errors.mealType.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Per Plate Price */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
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
                  <View>
                    <View className="flex-row items-center bg-background-light border border-outline-variant/50 rounded-lg px-4 py-3">
                      <MaterialIcons
                        name="attach-money"
                        size={20}
                        color="#896175"
                      />
                      <TextInput
                        placeholder="0.00"
                        placeholderTextColor="#896175"
                        className="flex-1 ml-2 text-base font-medium text-on-surface"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    {errors.perPlatePrice && (
                      <Text className="text-red-500 text-xs mt-2">
                        {errors.perPlatePrice.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Start Date & Time */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Start Date & Time
              </Text>
              <Controller
                control={control}
                name="startDateTime"
                rules={{ required: "Start date is required" }}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    value={value}
                    mode="datetime"
                    onChange={(_event, date) => {
                      if (date) onChange(date);
                    }}
                    materialDateLabel="Start Date"
                    materialTimeLabel="Start Time"
                  />
                )}
              />
            </View>

            {/* End Date & Time */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                End Date & Time
              </Text>
              <Controller
                control={control}
                name="endDateTime"
                rules={{ required: "End date is required" }}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    value={value}
                    mode="datetime"
                    onChange={(_event, date) => {
                      if (date) onChange(date);
                    }}
                    materialDateLabel="End Date"
                    materialTimeLabel="End Time"
                  />
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={createCateringMutation.isPending}
              activeOpacity={0.8}
              className="mt-8 rounded-lg bg-primary py-4 items-center justify-center overflow-hidden"
              style={shadowStyle}
            >
              {createCateringMutation.isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white text-base font-black tracking-tight">
                  Create Catering Plan
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
