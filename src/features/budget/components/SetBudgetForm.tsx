import { Text } from "@/src/components/ui/Text";
import { setBudgetSchema } from "@/src/features/budget/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUpdateEvent } from "../../events/hooks/use-event";

type SetBudgetFormProps = {
  eventId: number;
  onSuccess?: () => void;
};

export default function SetBudgetForm({
  eventId,
  onSuccess,
}: SetBudgetFormProps) {
  const { mutate: updateBudget, isPending } = useUpdateEvent(eventId);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(setBudgetSchema),
    defaultValues: {
      budget: "",
    },
  });

  const handleSetBudget = (data: { budget: number }) => {
    updateBudget(
      { budget: data.budget },
      {
        onSuccess: () => {
          Alert.alert("Success", "Budget set successfully");
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to set budget. Please try again.";
          Alert.alert("Error", errorMessage);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#f8f6f7] justify-center px-5"
    >
      <View className="bg-white rounded-md p-8 shadow-sm border border-gray-100">
        <View className="mb-8 items-center">
          <Text variant="h1" className="text-[#181114] text-2xl mb-2">
            Set Your Budget
          </Text>
          <Text variant="caption" className="text-gray-500 text-center">
            Define the total budget for your event
          </Text>
        </View>

        <View className="mb-6">
          <Text variant="h2" className="text-[#181114] mb-2 text-sm">
            Total Budget
          </Text>
          <View className="flex-row items-center gap-2 px-4 py-3 bg-gray-50 rounded-md border border-gray-100">
            <Text variant="h2" className="text-2xl text-[#ee2b8c]">
              ₹
            </Text>
            <Controller
              control={control}
              name="budget"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter budget amount"
                  keyboardType="decimal-pad"
                  className="flex-1 text-lg text-[#181114] bg-transparent"
                  placeholderTextColor="#a1a5ab"
                  editable={!isPending}
                />
              )}
            />
          </View>
          {errors.budget && (
            <Text variant="caption" className="text-red-500 mt-2">
              {errors.budget.message}
            </Text>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleSubmit(handleSetBudget)}
          disabled={isPending}
          className={`flex-row items-center justify-center gap-2 py-4 rounded-md ${
            isPending ? "bg-gray-300" : "bg-[#ee2b8c]"
          }`}
        >
          {isPending && <ActivityIndicator size="small" color="#fff" />}
          <Text variant="h2" className="text-white text-base">
            {isPending ? "Setting..." : "Set Budget"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
