import { InfoIcon } from "@/src/components/ui/InfoIcon";
import { Text } from "@/src/components/ui/Text";
import { deleteExpense } from "@/src/features/budget/services/budgetService";
import {
  useCategoryDetails,
  useDeleteCategoryMutation,
} from "@/src/features/budget/hooks/use-budget";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface Expense {
  id: number;
  name: string;
  estimatedCost: number;
  contractAmount: number;
  businessName: string;
  nextDueDate: string;
}

interface CategoryDetailsData {
  id: number;
  name: string;
  eventId: number;
  allocatedBudget: number;
  estimatedTotal: number;
  spend: number;
  pending: number;
  budgetBalance: number;
  createdAt: Date;
  updatedAt: Date;
  expenses: Expense[];
}

export default function CategoryDetailsScreen() {
  const router = useRouter();
  const { eventId, categoryId } = useLocalSearchParams();
  const { data, isLoading } = useCategoryDetails(Number(categoryId));
  const deleteMutation = useDeleteCategoryMutation(
    Number(categoryId || 0),
    Number(eventId || 0)
  );

  const queryClient = useQueryClient();
  const expenseDeleteMutation = useMutation({
    mutationFn: (expenseId: number) => deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category-details", Number(categoryId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["budget-summary", Number(eventId)],
      });
    },
  });

  const [menuVisible, setMenuVisible] = useState(false);

  const handleAddExpensePress = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/${categoryId}/add-expense`
    );
  };

  const handleEditCategory = () => {
    setMenuVisible(false);
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/edit-budget-category` as any,
      params: {
        categoryId: categoryId,
      },
    });
  };

  const handleDeleteCategory = () => {
    setMenuVisible(false);
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync();
              Alert.alert("Success", "Category deleted successfully!", [
                {
                  text: "OK",
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
            } catch (error: any) {
              const errorMessage =
                error?.message ||
                "Failed to delete category. Please try again.";
              Alert.alert("Error", errorMessage);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEditExpense = (expenseId: number) => {
    router.push({
      pathname: `/(protected)/(client-stack)/events/${eventId}/(organizer)/edit-expense`,
      params: {
        expenseId: expenseId.toString(),
        categoryId: categoryId,
        eventId: eventId,
      },
    } as any);
  };

  const handleDeleteExpense = (expenseId: number) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await expenseDeleteMutation.mutateAsync(expenseId);
              Alert.alert("Success", "Expense deleted successfully!");
            } catch (error: any) {
              const errorMessage =
                error?.message || "Failed to delete expense. Please try again.";
              Alert.alert("Error", errorMessage);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#ee2b8c" />
      </View>
    );
  }

  const categoryData = data as CategoryDetailsData;

  return (
    <View className="flex-1 bg-[#f8f6f7]">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              className="pr-4"
              activeOpacity={0.7}
            >
              <MaterialIcons name="more-vert" size={24} color="#181114" />
            </TouchableOpacity>
          ),
        }}
      />
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setMenuVisible(false)}
        >
          <View className="absolute bottom-0 bg-white shadow-lg w-full pb-4">
            <TouchableOpacity
              onPress={handleEditCategory}
              className="flex-row items-center gap-3 px-5 py-4 border-b border-gray-100"
            >
              <MaterialIcons name="edit" size={20} color="#181114" />
              <Text className="text-[#181114]" variant="h2">
                Edit Category
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteCategory}
              className="flex-row items-center gap-3 px-5 py-4"
            >
              <MaterialIcons name="delete" size={20} color="#ee2b8c" />
              <Text className="text-[#ee2b8c]" variant="h2">
                Delete Category
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-5 mt-5 bg-white rounded-md p-6 shadow-sm border border-gray-100 overflow-hidden">
          {/* Allocated Budget Header */}
          <View className="mb-6 py-3 border-b border-gray-100">
            <Text
              className="text-[10px] text-gray-400 mb-1 uppercase tracking-widest"
              variant="h2"
            >
              Allocated Budget
            </Text>
            <Text className="text-2xl text-[#181114] font-bold" variant="h1">
              Rs. {categoryData.allocatedBudget.toLocaleString()}
            </Text>
          </View>

          {/* Stats Section */}
          <View className="flex-row gap-4 justify-between p-4 bg-[#f8f6f7] rounded-md">
            <View className="items-center flex-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Text
                  className="text-[10px] text-gray-500 uppercase"
                  variant="h2"
                >
                  Spend
                </Text>
                <InfoIcon
                  title="Spend"
                  description="Total amount that has been paid out. This is the actual money spent from your allocated budget."
                  iconStyle="!text-gray-400"
                />
              </View>
              <Text
                className="text-sm text-[#ee2b8c] text-center"
                variant="h2"
                style={{ flexShrink: 1 }}
              >
                Rs. {categoryData.spend.toLocaleString()}
              </Text>
            </View>

            <View className="items-center flex-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Text
                  className="text-[10px] text-gray-500 uppercase"
                  variant="h2"
                >
                  Pending
                </Text>
                <InfoIcon
                  title="Pending"
                  description="Total amount that is owed but not yet paid. These are outstanding payments for contracted services."
                  iconStyle="!text-gray-400"
                />
              </View>
              <Text
                className="text-sm text-amber-600 text-center"
                style={{ flexShrink: 1 }}
                variant="h2"
              >
                Rs. {categoryData.pending.toLocaleString()}
              </Text>
            </View>

            <View className="items-center flex-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Text
                  className="text-[10px] text-gray-500 uppercase"
                  variant="h2"
                >
                  Balance
                </Text>
                <InfoIcon
                  title="Balance"
                  description="Amount remaining in this category that hasn't been spent or allocated."
                  iconStyle="!text-gray-400"
                />
              </View>
              <Text
                className={`text-sm text-center ${
                  categoryData.budgetBalance >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
                style={{ flexShrink: 1 }}
                variant="h2"
              >
                Rs. {Math.abs(categoryData.budgetBalance).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-5 mt-8 mb-4">
          <Text className="text-lg text-[#181114]" variant="h2">
            Associated Expenses
          </Text>
        </View>

        {/* Expenses List */}
        {categoryData?.expenses && categoryData.expenses.length > 0 ? (
          <View className="px-5 gap-3">
            {categoryData.expenses.map((expense: Expense) => (
              <View
                key={expense.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-start gap-4"
                  onPress={() => {
                    router.push(
                      `/(protected)/(client-stack)/events/${eventId}/(organizer)/${categoryId}/${expense.id}`
                    );
                  }}
                >
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text
                        className="text-base text-[#181114] flex-1"
                        variant="h2"
                      >
                        {expense.name}
                      </Text>
                    </View>
                    <View className="gap-1">
                      <View className="flex-row gap-2">
                        <Text className="text-xs text-gray-500" variant="h2">
                          Est:
                        </Text>
                        <Text className="text-xs text-[#181114]" variant="h2">
                          Rs. {expense.estimatedCost.toLocaleString()}
                        </Text>
                      </View>
                      <View className="flex-row gap-2">
                        <Text className="text-xs text-gray-500" variant="h2">
                          Contract:
                        </Text>
                        <Text className="text-xs text-[#181114] " variant="h2">
                          {expense.contractAmount
                            ? `Rs. ${expense.contractAmount.toLocaleString()}`
                            : "Not done"}
                        </Text>
                      </View>
                      <Text
                        className="text-[10px] text-gray-400 mt-1"
                        variant="h2"
                      >
                        Due {new Date(expense.nextDueDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#d1d5db" />
                </TouchableOpacity>

                <View className="flex-row justify-end items-center gap-3 mt-3">
                  <TouchableOpacity
                    onPress={() => handleEditExpense(expense.id)}
                    className="flex-row items-center gap-1 px-3 py-1.5 bg-blue-100 rounded-full"
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="edit" size={16} color="#2563eb" />
                    <Text className="text-xs text-blue-700" variant="h2">
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteExpense(expense.id)}
                    className="flex-row items-center gap-1 px-3 py-1.5 bg-red-100 rounded-full"
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="delete" size={16} color="#dc2626" />
                    <Text className="text-xs text-red-700" variant="h2">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="mx-5 bg-white rounded-2xl p-8 items-center gap-3">
            <MaterialIcons name="receipt-long" size={40} color="#d1d5db" />
            <Text className="text-gray-500 text-center" variant="h2">
              No expenses yet
            </Text>
            <Text className="text-xs text-gray-400 text-center" variant="h2">
              Add an expense to track spending in this category
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        className="absolute right-5 bottom-8 flex-row items-center gap-2 px-6 py-3 rounded-full bg-[#ee2b8c] shadow-lg active:opacity-80"
        activeOpacity={0.8}
        onPress={handleAddExpensePress}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text className="text-white text-xs  tracking-tight" variant="h2">
          Add Expense
        </Text>
      </TouchableOpacity>
    </View>
  );
}
