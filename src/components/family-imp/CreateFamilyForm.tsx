import { useCreateFamily } from "@/src/features/family/hooks/use-family";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

type CreateFamilyFormValues = {
  familyName: string;
};

export default function CreateFamilyForm() {
  const { mutate: createFamily, isPending } = useCreateFamily();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateFamilyFormValues>({
    defaultValues: { familyName: "" },
  });
  const hasValue = Boolean(watch("familyName")?.trim());

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
    <>
      <Controller
        control={control}
        name="familyName"
        rules={{ required: "Family name is required" }}
        render={({ field: { value, onBlur, onChange } }) => (
          <View>
            <Text className="text-xs uppercase tracking-wide font-jakarta-bold text-text-tertiary mb-2 ml-1">
              Family Name
            </Text>
            <View className="relative">
              <TextInput
                autoFocus
                placeholder="The Smith Family"
                placeholderTextColor="#9CA3AF"
                className={`w-full bg-background rounded-xl px-4 py-4 text-lg font-jakarta-medium text-text-primary border-2 pr-12 ${errors.familyName ? "border-red-500" : "border-border"}`}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
              <View className="absolute right-4 top-1/2 -translate-y-1/2">
                <Ionicons
                  name="create-outline"
                  size={20}
                  className={hasValue ? "text-primary" : "text-text-disabled"}
                />
              </View>
            </View>

            {errors.familyName ? (
              <Text className="mt-2 ml-1 text-xs text-red-500">
                {errors.familyName.message}
              </Text>
            ) : (
              <Text className="mt-2 ml-1 text-xs text-text-disabled">
                You can change this later in settings.
              </Text>
            )}
          </View>
        )}
      />

      <View className="pt-4 pb-8">
        <TouchableOpacity
          className="w-full rounded-xl py-4 bg-primary items-center justify-center shadow-lg shadow-primary/30"
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          activeOpacity={0.85}
        >
          <Text className="text-white text-lg font-jakarta-bold">
            {isPending ? "Creating..." : "Create Family"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
