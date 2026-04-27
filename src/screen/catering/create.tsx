import { DatePicker } from "@/components/nativewindui/DatePicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/Text";
import { cn } from "../../utils/cn";
import { shadowStyle } from "../../utils/helper";
import { useCreateCateringMutation } from "@/src/features/catering";

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
        per_plate_price: data.perPlatePrice,
        startDateTime: data.startDateTime.toISOString(),
        endDateTime: data.endDateTime.toISOString(),
        meal_type: data.mealType,
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

                        <View>
                            <Text className="text-3xl font-black text-on-surface tracking-tighter mb-2">
                                Add Catering
                            </Text>
                            <Text className="text-muted-light font-medium text-lg leading-6">
                                Design a premium culinary experience for your guests.
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* Form Content */}
                    <View className="px-6 -mt-8">

                        {/* Meal Type Selection */}
                        <View className="mb-8">
                            <Text className="text-lg font-bold text-on-surface tracking-tight mb-4 px-1">
                                Meal Selection
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 12, paddingRight: 20 }}
                                className="py-1"
                            >
                                {MEAL_OPTIONS.map((option) => {
                                    const isSelected = selectedMeal === option.type;
                                    return (
                                        <Pressable
                                            key={option.type}
                                            onPress={() => setSelectedMeal(option.type)}
                                            className={cn(
                                                "items-center justify-center p-4 rounded-[24px] min-w-[90px] border bg-white",
                                                isSelected ? "bg-primary border-primary" : "bg-white border-outline-variant/30"
                                            )}
                                            style={isSelected ? { ...shadowStyle, shadowColor: "#ee2b8c", shadowOpacity: 0.3 } : shadowStyle}
                                        >
                                            <View
                                                className={cn(
                                                    "w-12 h-12 rounded-md items-center justify-center mb-2",
                                                    isSelected ? "bg-white/20" : "bg-background-light"
                                                )}
                                            >
                                                <MaterialIcons
                                                    name={option.icon}
                                                    size={24}
                                                    color={isSelected ? "white" : option.color}
                                                />
                                            </View>
                                            <Text
                                                className={cn(
                                                    "text-[12px] font-black uppercase tracking-tighter",
                                                    isSelected ? "text-white" : "text-on-surface-variant"
                                                )}
                                            >
                                                {option.type}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Event Details */}
                        <FormSection title="Event Details" icon="calendar-outline">
                            <CustomInput
                                label="Plan Title"
                                placeholder="e.g. Wedding Reception Dinner"
                                value={title}
                                onChangeText={setTitle}
                                icon="title"
                            />
                            <CustomInput
                                label="Select Vendor"
                                placeholder="Search for catering vendors..."
                                value={vendor}
                                onChangeText={setVendor}
                                icon="restaurant"
                            />
                        </FormSection>

                        {/* Logistics */}
                        <FormSection title="Logistics" icon="people-outline">
                            <CustomInput
                                label="Guest Count (Pax)"
                                placeholder="Total number of guests"
                                value={pax}
                                onChangeText={setPax}
                                keyboardType="numeric"
                                icon="group"
                            />
                            <View className="mb-2">
                                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                                    Timeline
                                </Text>
                                <Pressable
                                    className="flex-row items-center bg-background-light/50 border border-outline-variant/50 rounded-md px-4 py-3.5"
                                >
                                    <MaterialIcons name="schedule" size={20} color="#896175" className="mr-3" />
                                    <Text className="flex-1 text-[16px] font-medium text-muted-light">
                                        Select Start & End Time
                                    </Text>
                                    <MaterialIcons name="arrow-drop-down" size={24} color="#896175" />
                                </Pressable>
                            </View>
                        </FormSection>

                        {/* Menu & Notes */}
                        <FormSection title="Menu & Notes" icon="document-text-outline">
                            <View>
                                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                                    Special Instructions
                                </Text>
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Dieters, Allergies, or Menu details..."
                                    placeholderTextColor="#896175"
                                    className="bg-background-light/50 border border-outline-variant/50 rounded-md px-4 py-4 min-h-[120px] text-[16px] font-medium text-on-surface"
                                    style={{ textAlignVertical: "top" }}
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>
                        </FormSection>

                        {/* Action Button */}
                        <TouchableOpacity
                            onPress={handleSave}
                            activeOpacity={0.8}
                            className="mt-4 mb-10 overflow-hidden rounded-md bg-white"
                            style={{ ...shadowStyle, shadowColor: "#ee2b8c", shadowOpacity: 0.4 }}
                        >
                            <LinearGradient
                                colors={["#ee2b8c", "#d11d73"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="py-5 items-center flex-row justify-center"
                            >
                                <Text className="text-white text-lg font-black tracking-tight mr-2">
                                    Create Catering Plan
                                </Text>
                                <MaterialIcons name="check-circle" size={20} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Footer Tag */}
                        <View className="items-center pb-8">
                            <Text className="text-[10px] font-black text-muted-light uppercase tracking-[4px]">
                                Powered by Khumbaya
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
                