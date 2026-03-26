
import { DatePicker } from "@/components/nativewindui/DatePicker";
import api from "@/src/api/axios";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  View,
} from "react-native";

interface ExpenseFormData {
  name: string;
  estimatedCost: string;
  contractAmount: string;
  nextDueDate: string;
  notes: string;
}

export default function AddExpenseForm() {
  const router = useRouter();

  const { eventId, categoryId, expenseId } = useLocalSearchParams<{
    eventId?: string;
    categoryId?: string;
    expenseId?: string;
  }>();

  const isEditMode = !!expenseId;

  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    estimatedCost: "",
    contractAmount: "",
    nextDueDate: "",
    notes: "",
  });

  const [selectedDueDate, setSelectedDueDate] = useState<Date>(
    new Date()
  );


  useEffect(() => {
    if (isEditMode) {
      const fetchExpense = async () => {
        try {
          const res = await api.get(`/expense/${expenseId}`);
          const data = res.data.data;

          setFormData({
            name: data.name || "",
            estimatedCost: String(data.estimatedCost || ""),
            contractAmount: String(data.contractAmount || ""),
            nextDueDate: data.nextDueDate || "",
            notes: data.notes || "",
          });

          if (data.nextDueDate) {
            setSelectedDueDate(new Date(data.nextDueDate));
          }
        } catch (err) {
          Alert.alert("Error", "Failed to load expense");
        }
      };

      fetchExpense();
    }
  }, [expenseId]);


  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    if (event.type === "dismissed" || !date) return;

    setSelectedDueDate(date);

    const formattedDate = date.toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      nextDueDate: formattedDate,
    }));
  };

  const handleChange = (
    field: keyof ExpenseFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createMutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const payload = {
        name: data.name,
        estimatedCost: parseFloat(data.estimatedCost) || 0,
        contractAmount: parseFloat(data.contractAmount) || 0,
        nextDueDate: data.nextDueDate || "",
        notes: data.notes || "",
        categoryId: categoryId ? parseInt(categoryId) : 0,
      };

      const res = await api.post(
        `/event/${eventId}/budget-expense/create`,
        payload
      );

      return res.data;
    },
    onSuccess: () => {
      Alert.alert("Success", "Expense added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.message || "Failed to add expense"
      );
    },
  });


  const updateMutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const payload = {
        name: data.name,
        estimatedCost: parseFloat(data.estimatedCost) || 0,
        contractAmount: parseFloat(data.contractAmount) || 0,
        nextDueDate: data.nextDueDate || "",
        notes: data.notes || "",
      };

      const res = await api.put(
        `/expense/${expenseId}`,
        payload
      );

      return res.data;
    },
    onSuccess: () => {
      Alert.alert("Success", "Expense updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
  });


  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/expense/${expenseId}`);
    },
    onSuccess: () => {
      Alert.alert("Deleted", "Expense removed!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
  });


  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Enter expense name");
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <View className="flex-1 bg-[#f8f6f7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <Text className="text-sm font-bold mb-2">
          Expense Name
        </Text>
        <View className="bg-white rounded-md px-4 h-14 mb-4 border border-gray-100">
          <TextInput
            value={formData.name}
            onChangeText={(v) => handleChange("name", v)}
            placeholder="e.g., Decoration"
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm font-medium text-[#181114]"
          />
        </View>

        {/* Estimated */}
        <Text className="text-sm font-bold mb-2">
          Estimated Cost
        </Text>
        <View className="bg-white rounded-md px-4 h-14 flex-row items-center mb-4 border border-gray-100">
          <Text className="text-sm font-medium text-[#181114]">Rs. </Text>
          <TextInput
            value={formData.estimatedCost}
            onChangeText={(v) =>
              handleChange("estimatedCost", v)
            }
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm font-medium text-[#181114]"
          />
        </View>

        {/* Contract */}
        <Text className="text-sm font-bold mb-2">
          Contract Amount
        </Text>
        <View className="bg-white rounded-md px-4 h-14 flex-row items-center mb-4 border border-gray-100">
          <Text className="text-sm font-medium text-[#181114]">Rs. </Text>
          <TextInput
            value={formData.contractAmount}
            onChangeText={(v) =>
              handleChange("contractAmount", v)
            }
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm font-medium text-[#181114]"
          />
        </View>

        {/* Date */}
        <Text className="text-sm font-bold mb-2">
          Next Due Date
        </Text>
        <View className="mb-6">
          <DatePicker
            value={selectedDueDate}
            mode="date"
            onChange={handleDateChange}
            materialDateLabel=" Due Date"
            materialDateLabelClassName="text-xs"
          />
        </View>

        {/* Notes */}
        <Text className="text-sm font-bold mt-4 mb-2">
          Notes
        </Text>
        <View className="bg-white rounded-md px-4 py-3 mb-6 border border-gray-100 min-h-[100px]">
          <TextInput
            value={formData.notes}
            onChangeText={(v) => handleChange("notes", v)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Add any additional notes..."
            placeholderTextColor="#9ca3af"
            className="text-sm font-medium text-[#181114]"
          />
        </View>

        {/* Submit */}
        <Button
          onPress={handleSubmit}
          disabled={isLoading}
          className="bg-pink-600 h-14 items-center justify-center"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">
              {isEditMode
                ? "Update Expense"
                : "Add Expense"}
            </Text>
          )}
        </Button>

        {/* Delete (only edit mode) */}
        {isEditMode && (
          <Button
            onPress={() =>
              Alert.alert(
                "Delete",
                "Are you sure?",
                [
                  { text: "Cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                      deleteMutation.mutate(),
                  },
                ]
              )
            }
            className="bg-red-500 mt-4 h-14 items-center justify-center"
          >
            <Text className="text-white font-bold">
              Delete Expense
            </Text>
          </Button>
        )}
      </ScrollView>
    </View>
  );
}