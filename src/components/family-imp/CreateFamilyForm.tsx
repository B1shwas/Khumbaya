import { useCreateFamily } from "@/src/features/family/hooks/use-family";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

type CreateFamilyFormValues = {
  familyName: string;
};

const PRIMARY = "#ec4899";

export default function CreateFamilyForm() {
  const { mutate: createFamily, isPending } = useCreateFamily();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateFamilyFormValues>({
    defaultValues: { familyName: "" },
  });

  const onSubmit = ({ familyName }: CreateFamilyFormValues) => {
    createFamily(
      { familyName: familyName.trim() },
      {
        onSuccess: () => {
          Alert.alert("Success", "Family created successfully");
          reset();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to create family";
          Alert.alert("Error", message);
        },
      }
    );
  };

  return (
    <View className="p-4">
      <Text className="text-base text-gray-700 mb-2">Family Name *</Text>
      <Controller
        control={control}
        name="familyName"
        rules={{ required: "Family name is required" }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            placeholder="Enter your family name"
            placeholderTextColor="#9CA3AF"
            className={`bg-white rounded-xl px-4 py-3.5 border text-gray-800 ${errors.familyName ? "border-red-500" : "border-gray-200"}`}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.familyName && (
        <Text className="text-xs text-red-500 mt-1">
          {errors.familyName.message}
        </Text>
      )}

      <TouchableOpacity
        className="bg-pink-500 rounded-xl py-4 mt-6 items-center justify-center flex-row"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-white text-base font-semibold">
          {isPending ? "Creating..." : "Create Family"}
        </Text>
        {!isPending && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
