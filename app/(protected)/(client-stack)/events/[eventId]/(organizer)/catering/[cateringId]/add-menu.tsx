import { Text } from "@/src/components/ui/Text";
import { useCreateMenuMutation } from "@/src/features/catering/menu";
import { shadowStyle } from "@/src/utils/helper";
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

// ─── Types & Constants

interface MenuFormData {
  name: string;
  description: string;
  type: string;
  menuType: string;
}

const MENU_TYPE_OPTIONS = [
  { label: "Starter", value: "Starter" },
  { label: "Main Course", value: "Main Course" },
  { label: "Dessert", value: "Dessert" },
  { label: "Beverage", value: "Beverage" },
  { label: "Appetizer", value: "Appetizer" },
];

const DISH_TYPE_OPTIONS = [
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Non-Vegetarian", value: "Non-Vegetarian" },
  { label: "Vegan", value: "Vegan" },
];

export default function AddMenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = parseInt(params.eventId as string, 10);
  const cateringId = parseInt(params.cateringId as string, 10);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuFormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "Vegetarian",
      menuType: "Main Course",
    },
  });

  const createMenuMutation = useCreateMenuMutation(cateringId);

  const onSubmit = async (data: MenuFormData) => {
    try {
      await createMenuMutation.mutateAsync({
        name: data.name,
        description: data.description,
        type: data.type ?? "Vegetarian",
        menuType: data.menuType,
      });

      Alert.alert("Success", "Menu item added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add menu item";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
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
            {/* Dish Name */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Dish Name
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Dish name is required",
                  maxLength: {
                    value: 255,
                    message: "Name must be less than 255 characters",
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <View>
                    <TextInput
                      placeholder="e.g., Paneer Tikka Masala"
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

            {/* Description */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Description
              </Text>
              <Controller
                control={control}
                name="description"
                rules={{
                  required: "Description is required",
                  maxLength: {
                    value: 255,
                    message: "Description must be less than 255 characters",
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <View>
                    <TextInput
                      placeholder="Brief description of the dish"
                      placeholderTextColor="#896175"
                      className="bg-background-light border border-outline-variant/50 rounded-lg px-4 py-3 text-base font-medium text-on-surface min-h-[100px]"
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={3}
                      style={{ textAlignVertical: "top" }}
                    />
                    {errors.description && (
                      <Text className="text-red-500 text-xs mt-2">
                        {errors.description.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Dish Type 
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Dish Type
              </Text>
              <Controller
                control={control}
                name="type"
                rules={{ required: "Dish type is required" }}
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
                      data={DISH_TYPE_OPTIONS}
                      labelField="label"
                      valueField="value"
                      placeholder="Select dish type"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                      selectedTextStyle={{
                        color: "#ee2b8c",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                      placeholderStyle={{
                        color: "#896175",
                        fontSize: 16,
                      }}
                      itemTextStyle={{
                        color: "#1a1a1a",
                        fontSize: 16,
                      }}
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
                    {errors.type && (
                      <Text className="text-red-500 text-xs mt-2">
                        {errors.type.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
*/}

            {/* Menu Type */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-on-surface mb-3">
                Menu Category
              </Text>
              <Controller
                control={control}
                name="menuType"
                rules={{ required: "Menu category is required" }}
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
                      data={MENU_TYPE_OPTIONS}
                      labelField="label"
                      valueField="value"
                      placeholder="Select menu category"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                      selectedTextStyle={{
                        color: "#ee2b8c",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                      placeholderStyle={{
                        color: "#896175",
                        fontSize: 16,
                      }}
                      itemTextStyle={{
                        color: "#1a1a1a",
                        fontSize: 16,
                      }}
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
                    {errors.menuType && (
                      <Text className="text-red-500 text-xs mt-2">
                        {errors.menuType.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={createMenuMutation.isPending}
              activeOpacity={0.8}
              className="rounded-lg bg-primary py-4 items-center justify-center overflow-hidden"
              style={shadowStyle}
            >
              {createMenuMutation.isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white text-base font-black tracking-tight">
                  Add Menu Item
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
