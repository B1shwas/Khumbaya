import { Text } from "@/src/components/ui/Text";
import { useBudgetCategoryMutation } from "@/src/features/budget/hooks/use-budget";
import { budgetCategoryFormSchema } from "@/src/features/budget/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const CATEGORIES = [
  { id: "venue", label: "Venue & Site", icon: "location-on" },
  { id: "catering", label: "Catering", icon: "restaurant" },
  { id: "apparel", label: "Apparel", icon: "checkroom" },
  { id: "flowers", label: "Flowers & Decor", icon: "local-florist" },
  { id: "photography", label: "Photography", icon: "camera-alt" },
  { id: "entertainment", label: "Entertainment", icon: "music-note" },
  { id: "transportation", label: "Transportation", icon: "directions-car" },
  { id: "other", label: "Other", icon: "more-horiz" },
];

const categoryData = CATEGORIES.map((cat) => ({
  label: cat.label,
  value: cat.id,
}));

export default function AddBudgetItemScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetCategoryFormSchema),
    defaultValues: {
      name: "",
      allocatedBudget: "",
    },
  });

  const mutation = useBudgetCategoryMutation(Number(eventId || 0));

  const onSubmit = async (data: any) => {
    if (!eventId) {
      Alert.alert("Error", "Event ID is missing");
      return;
    }

    try {
      await mutation.mutateAsync({
        name: data.name,
        allocatedBudget: data.allocatedBudget,
      });

      Alert.alert("Success", "Budget category created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to create budget category. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-[#f8f6f7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm text-gray-700 mb-2" variant="h2">
          Category
        </Text>
        <View className="bg-white rounded-md shadow-sm border border-gray-100 mb-6">
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                style={{
                  height: 50,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  backgroundColor: "white",
                }}
                placeholderStyle={{ color: "#9CA3AF" }}
                selectedTextStyle={{ color: "#111827", fontSize: 14 }}
                data={CATEGORIES}
                labelField="label"
                valueField="value"
                placeholder="Select a category"
                value={value}
                onChange={(item: any) => onChange(item.value)}
              />
            )}
          />
        </View>
        {errors.name && (
          <Text className="text-red-500 text-xs mb-4">
            {errors.name.message}
          </Text>
        )}

        <Text className="text-sm  text-gray-700 mb-2" variant="h2">
          Allocated Budget
        </Text>
        <View className="bg-white rounded-sm px-4 h-14 shadow-sm border border-gray-100 mb-6">
          <Controller
            control={control}
            name="allocatedBudget"
            render={({ field: { value, onChange } }) => (
              <TextInput
                className="flex-1 text-sm font-medium text-[#181114]"
                placeholder="Rs. 0"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
              />
            )}
          />
        </View>
        {errors.allocatedBudget && (
          <Text className="text-red-500 text-xs mb-4">
            {errors.allocatedBudget.message}
          </Text>
        )}

        <TouchableOpacity
          className="bg-[#ee2b8c] rounded-md h-14 items-center justify-center shadow-lg disabled:opacity-50"
          activeOpacity={0.8}
          disabled={mutation.isPending}
          onPress={handleSubmit(onSubmit)}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base" variant="h2">
              Add Budget Category
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
