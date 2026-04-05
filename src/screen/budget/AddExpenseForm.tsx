import { Text } from "@/src/components/ui/Text";
import {
  useExpenseById,
  useExpenseMutation,
  useUpdateExpenseMutation,
} from "@/src/features/budget/hooks/use-budget";
import { expenseFormSchema } from "@/src/features/budget/schema";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface AddExpenseScreenProps {
  editMode?: boolean;
}

export default function AddExpenseScreen({
  editMode = false,
}: AddExpenseScreenProps) {
  const router = useRouter();
  const { categoryId, eventId, expenseId } = useLocalSearchParams();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch expense data in edit mode
  const { data: expenseData, isLoading: isExpenseLoading } = useExpenseById(
    Number(expenseId || 0),
    { enabled: editMode && !!expenseId }
  );

  const expenseMutation = useExpenseMutation(
    Number(categoryId),
    Number(eventId)
  );

  const updateMutation = useUpdateExpenseMutation(
    Number(expenseId || 0),
    Number(categoryId),
    Number(eventId)
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: "",
      allocatedAmount: "",
      nextDueDate: "",
      notes: "",
    },
  });

  const nextDueDate = watch("nextDueDate");

  useEffect(() => {
    if (editMode && expenseData) {
      setValue("name", expenseData.name);
      setValue(
        "allocatedAmount",
        expenseData.allocatedAmount?.toString() || ""
      );
      setValue("nextDueDate", expenseData.nextDueDate || "");
      setValue("notes", expenseData.notes || "");
    }
  }, [editMode, expenseData, setValue]);

  const handleDateChange = (event: any, date: Date | undefined) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setValue("nextDueDate", formattedDate);
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const payload = {
        name: data.name,
        allocatedAmount: parseFloat(data.allocatedAmount),
        nextDueDate: data.nextDueDate || undefined,
        notes: data.notes || undefined,
      };

      const mutation = editMode ? updateMutation : expenseMutation;
      await mutation.mutateAsync(payload);

      const action = editMode ? "updated" : "created";
      Alert.alert("Success", `Expense ${action} successfully!`, [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to save expense. Please try again."
      );
    }
  };

  if (editMode && isExpenseLoading) {
    return (
      <View className="flex-1 bg-[#f8f6f7] items-center justify-center">
        <ActivityIndicator size="large" color="#ee2b8c" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-[#f8f6f7]">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-32"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-8">
            {!editMode && (
              <View className="mb-8">
                <View>
                  <Text className="text-3xl text-[#181114]" variant="h1">
                    Detail your new
                  </Text>
                  <Text className="text-3xl text-[#ee2b8c]" variant="h1">
                    financial commitment.
                  </Text>
                </View>
              </View>
            )}

            {/* Form Card */}
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 gap-6 mb-8">
              {/* Expense Name */}
              <View className="gap-2">
                <Text className="text-sm text-gray-600 ml-1" variant="h2">
                  Expense Name
                </Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput
                        className="w-full h-14 bg-[#f8f6f7] px-4 rounded-md text-[#181114] border border-gray-100 focus:border-[#ee2b8c]"
                        placeholder="e.g. Adobe Creative Cloud"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                      />
                      {errors.name && (
                        <Text
                          className="text-xs text-red-500 mt-1"
                          variant="h2"
                        >
                          {errors.name.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              <View className="gap-6">
                {/* Allocated Amount */}
                <View className="gap-2">
                  <Text className="text-sm text-gray-600 ml-1" variant="h2">
                    Allocated Amount
                  </Text>
                  <Controller
                    control={control}
                    name="allocatedAmount"
                    render={({ field: { onChange, value } }) => (
                      <View>
                        <View className="relative">
                          <Text
                            className="absolute left-4 top-3.5 text-sm text-gray-600"
                            variant="h2"
                          >
                            Rs.
                          </Text>
                          <TextInput
                            className="w-full h-14 bg-[#f8f6f7] pl-12 pr-4 rounded-md text-[#181114] border border-gray-100"
                            placeholder="0.00"
                            placeholderTextColor="#999"
                            keyboardType="decimal-pad"
                            value={value}
                            onChangeText={onChange}
                          />
                        </View>
                        {errors.allocatedAmount && (
                          <Text
                            className="text-xs text-red-500 mt-1"
                            variant="h2"
                          >
                            {errors.allocatedAmount.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>

                {/* Due Date */}
                <View className="gap-2">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm text-gray-600 ml-1" variant="h2">
                      Next Due Date
                    </Text>
                    <Text className="text-[10px] text-gray-400" variant="h2">
                      (Optional)
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="h-14 bg-[#f8f6f7] px-4 rounded-md border border-gray-100 flex-row items-center"
                  >
                    <MaterialIcons
                      name="calendar-today"
                      size={20}
                      color="#999"
                    />
                    <Text className="ml-3 text-[#181114]" variant="h2">
                      {nextDueDate ? nextDueDate : "Select date"}
                    </Text>
                  </TouchableOpacity>
                  {errors.nextDueDate && (
                    <Text className="text-xs text-red-500 mt-1" variant="h2">
                      {errors.nextDueDate.message}
                    </Text>
                  )}
                  {showDatePicker && (
                    <DateTimePicker
                      value={nextDueDate ? new Date(nextDueDate) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>
              </View>

              {/* Notes */}
              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm text-gray-600 ml-1" variant="h2">
                    Notes
                  </Text>
                  <Text className="text-[10px] text-gray-400" variant="h2">
                    (Optional)
                  </Text>
                </View>
                <Controller
                  control={control}
                  name="notes"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput
                        className="w-full bg-[#f8f6f7] px-4 py-3 rounded-md text-[#181114] border border-gray-100"
                        placeholder="Additional details or terms..."
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        multiline
                        numberOfLines={3}
                      />
                      {errors.notes && (
                        <Text
                          className="text-xs text-red-500 mt-1"
                          variant="h2"
                        >
                          {errors.notes.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={expenseMutation.isPending}
                className="h-16 bg-[#ee2b8c] rounded-md flex items-center justify-center mt-2"
                activeOpacity={0.8}
              >
                {expenseMutation.isPending ? (
                  <MaterialIcons
                    name="hourglass-empty"
                    size={24}
                    color="white"
                  />
                ) : (
                  <Text className="text-white text-base" variant="h2">
                    Create Expense
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
