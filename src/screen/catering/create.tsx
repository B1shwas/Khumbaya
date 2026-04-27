import { DatePicker } from "@/components/nativewindui/DatePicker";
import { Text } from "@/src/components/ui/Text";
import { useCreateCateringMutation } from "@/src/features/catering";
import { cn } from "@/src/utils/cn";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
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
  const eventId = Number(params.eventId);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CateringFormData>({
    defaultValues: {
      name: "",
      mealType: "Lunch",
      perPlatePrice: "",
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 3600000),
    },
  });

  const createCateringMutation = useCreateCateringMutation(eventId);
  const startDateTime = watch("startDateTime");
  const endDateTime = watch("endDateTime");
  const isSubmitting = createCateringMutation.status === "pending";

  const handleCreate = async (data: CateringFormData) => {
    if (data.endDateTime <= data.startDateTime) {
      Alert.alert("Validation error", "End time must be after start time.");
      return;
    }

    try {
      await createCateringMutation.mutateAsync({
        name: data.name,
        per_plate_price: data.perPlatePrice,
        startDateTime: data.startDateTime.toISOString(),
        endDateTime: data.endDateTime.toISOString(),
        meal_type: data.mealType,
      });

      Alert.alert("Success", "Catering plan created successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to create catering plan.";
      Alert.alert("Error", errorMessage);
    }
  };

  if (!eventId || Number.isNaN(eventId)) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-light"
        edges={["top", "bottom"]}
      >
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-bold text-on-surface mb-3">
            Invalid event
          </Text>
          <Text className="text-center text-muted-light">
            The event ID is missing or invalid. Please return to the event and
            try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <View className="px-6 py-6">
            <Text className="text-3xl font-black text-on-surface tracking-tighter mb-2">
              Add Catering Plan
            </Text>
            <Text className="text-muted-light font-medium text-lg leading-6 mb-6">
              Create a new catering package for your event.
            </Text>

            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Plan Name
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: "Plan name is required" }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <TextInput
                      placeholder="e.g. Wedding Reception Dinner"
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
                  </>
                )}
              />
            </View>

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

            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Per Plate Price
              </Text>
              <Controller
                control={control}
                name="perPlatePrice"
                rules={{ required: "Price is required" }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <TextInput
                      placeholder="e.g. 2500"
                      placeholderTextColor="#896175"
                      keyboardType="numeric"
                      className="bg-background-light border border-outline-variant/50 rounded-lg px-4 py-3 text-base font-medium text-on-surface"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.perPlatePrice && (
                      <Text className="text-red-500 text-xs mt-2">
                        {errors.perPlatePrice.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Start Date & Time
              </Text>
              <View className="rounded-2xl overflow-hidden border border-outline-variant/50 bg-white">
                <DatePicker
                  mode="date"
                  value={startDateTime}
                  onChange={(_, date) => {
                    if (date) {
                      setValue("startDateTime", new Date(date));
                    }
                  }}
                />
                <DatePicker
                  mode="time"
                  value={startDateTime}
                  onChange={(_, date) => {
                    if (date) {
                      const updated = new Date(startDateTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      setValue("startDateTime", updated);
                    }
                  }}
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-sm font-bold text-on-surface mb-3">
                End Date & Time
              </Text>
              <View className="rounded-2xl overflow-hidden border border-outline-variant/50 bg-white">
                <DatePicker
                  mode="date"
                  value={endDateTime}
                  onChange={(_, date) => {
                    if (date) {
                      setValue("endDateTime", new Date(date));
                    }
                  }}
                />
                <DatePicker
                  mode="time"
                  value={endDateTime}
                  onChange={(_, date) => {
                    if (date) {
                      const updated = new Date(endDateTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      setValue("endDateTime", updated);
                    }
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit(handleCreate)}
              disabled={isSubmitting}
              activeOpacity={0.8}
              className={cn(
                "overflow-hidden rounded-md",
                isSubmitting ? "opacity-70" : ""
              )}
              style={shadowStyle}
            >
              <LinearGradient
                colors={
                  isSubmitting ? ["#dcb3c1", "#e2a1c1"] : ["#ee2b8c", "#d11d73"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-5 items-center"
              >
                <Text className="text-white text-lg font-black tracking-tight">
                  {isSubmitting ? "Creating..." : "Create Catering Plan"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
