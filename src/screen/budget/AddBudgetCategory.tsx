import { Text } from "@/src/components/ui/Text";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
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

interface AddBudgetFormData {
  category: string;
  allocatedBudget: string;
}

export default function AddBudgetItemScreen() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<AddBudgetFormData>({
    defaultValues: {
      category: "",
      allocatedBudget: "",
    },
  });

  const onSubmit = (data: AddBudgetFormData) => {
    console.log(data);
    router.back();
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
            name="category"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  height: 50,
                }}
                placeholderStyle={{
                  fontSize: 14,
                  color: "#9ca3af",
                }}
                selectedTextStyle={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#181114",
                }}
                iconStyle={{
                  tintColor: "#6b7280",
                }}
                data={categoryData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select a category"
                value={value}
                onChange={(item: { value: string }) => {
                  onChange(item.value);
                }}
              />
            )}
          />
        </View>

        <Text className="text-sm  text-gray-700 mb-2" variant="h2">
          Allocated Budget
        </Text>
        <View className="bg-white rounded-md px-4 h-14 shadow-sm border border-gray-100 mb-6">
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

        <TouchableOpacity
          className="bg-[#ee2b8c] rounded-md h-14 items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-base" variant="h2">
            Add Budget Category
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
