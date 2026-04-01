import { BudgetStatsGrid } from "@/src/components/budget";
import { Text } from "@/src/components/ui/Text";
import {
  useDeleteExpenseMutation,
  useDeletePaymentMutation,
  useExpenseById,
} from "@/src/features/budget/hooks/use-budget";
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

type Expense = {
  id: number;
  categoryId: number;
  name: string;
  businessId: number | null;
  estimatedCost: number;
  contractAmount: number | null;
  nextDueDate: Date;
  notes: string;
  spend: number;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
};

type Payment = {
  id: number;
  expenseId: number;
  name: string;
  amount: number;
  paidOn: string;
  mode: string;
  status: "cleared" | "bank_transfer";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const { eventId, categoryId, expenseId } = useLocalSearchParams();
  const { data, isLoading } = useExpenseById(Number(expenseId));
  const [menuVisible, setMenuVisible] = useState(false);
  const deleteMutation = useDeleteExpenseMutation(
    Number(expenseId || 0),
    Number(categoryId || 0),
    Number(eventId || 0)
  );

  const deletePaymentMutation = useDeletePaymentMutation(
    0, // paymentId is set when delete is triggered
    Number(expenseId || 0),
    Number(categoryId || 0),
    Number(eventId || 0)
  );

  let remainingBalance,
    dueBalance,
    percentPaid = null;
  if (!isLoading) {
    remainingBalance = data.estimatedCost - data.spend;
    dueBalance = data.contractAmount ? data.contractAmount - data.spend : null;

    if (data.contractAmount) {
      percentPaid = Math.round((data.spend / data.contractAmount) * 100);
    }
  }

  const handleAddPaymentPress = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/${categoryId}/${expenseId}/add-payment`
    );
  };

  const handleEditExpense = () => {
    setMenuVisible(false);
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/edit-expense` as any,
      params: {
        expenseId: expenseId,
        categoryId: categoryId,
        eventId: eventId,
      },
    });
  };

  const handleEditPayment = (paymentId: number) => {
    router.push({
      pathname:
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/edit-payment` as any,
      params: {
        paymentId: paymentId.toString(),
        expenseId: expenseId,
        categoryId: categoryId,
        eventId: eventId,
      },
    });
  };

  const handleDeletePayment = (paymentId: number) => {
    Alert.alert(
      "Delete Payment",
      "Are you sure you want to delete this payment? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePaymentMutation.mutateAsync(paymentId);
              Alert.alert("Success", "Payment deleted successfully.");
            } catch (error: any) {
              const errorMessage =
                error?.message || "Failed to delete payment. Please try again.";
              Alert.alert("Error", errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleDeleteExpense = () => {
    setMenuVisible(false);
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense? This action cannot be undone.",
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
              Alert.alert("Success", "Expense deleted successfully!", [
                {
                  text: "OK",
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
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
              onPress={handleEditExpense}
              className="flex-row items-center gap-3 px-5 py-4 border-b border-gray-100"
            >
              <MaterialIcons name="edit" size={20} color="#181114" />
              <Text className="text-[#181114]" variant="h2">
                Edit Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteExpense}
              className="flex-row items-center gap-3 px-5 py-4"
            >
              <MaterialIcons name="delete" size={20} color="#ee2b8c" />
              <Text className="text-[#ee2b8c]" variant="h2">
                Delete Expense
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
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text variant="h1" className="text-[#181114] mb-2 text-2xl">
                {data.name}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text variant="caption" className="text-base">
                  {/* currently storing bussinessid in backend . this has not been implemented properly. after the implementation , we will be able to join that business name  */}
                  {data.bussinessId || "Vendor"}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-[#ee2b8c]/10 rounded-md p-6 flex-row items-center gap-4 border border-[#ee2b8c]/70">
            {data.contractAmount ? (
              <>
                <View>
                  <Text
                    variant="h2"
                    className="text-[#9d1759] uppercase tracking-wider mb-1 text-xs"
                  >
                    Balance Due
                  </Text>
                  <Text variant="h1" className="text-[#ee2b8c] text-xl">
                    Rs. {dueBalance?.toLocaleString()}
                  </Text>
                </View>

                <View className="h-10 w-px bg-[#ee2b8c]/20" />

                <View className="flex-1 items-center gap-1">
                  <View className="h-2 w-24 bg-gray-200 rounded-md overflow-hidden">
                    <View
                      className="h-full bg-[#ee2b8c]"
                      style={{ width: `${percentPaid ?? 0}%` }}
                    />
                  </View>
                  <Text variant="h2" className="text-gray-500">
                    {percentPaid ?? 0}% Paid
                  </Text>
                </View>
              </>
            ) : (
              <View className="flex-1 items-center gap-2">
                <MaterialIcons name="warning" size={24} color="#ee2b8c" />
                <Text variant="h2" className="text-[#9d1759] text-center">
                  You have not finalized the contract yet
                </Text>
              </View>
            )}
          </View>

          <BudgetStatsGrid
            stats={[
              { label: "Estimated", value: data.estimatedCost },
              { label: "Contract", value: data.contractAmount },
              { label: "Spent", value: data.spend },
              { label: "Balance", value: remainingBalance },
            ]}
            variant="expense"
          />
        </View>

        <View className="mx-5 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text variant="h2" className="text-[#181114] text-lg">
              Payment History
            </Text>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text variant="h2" className="text-gray-600">
                {data.payments.length} Payments
              </Text>
            </View>
          </View>

          {data.payments.length > 0 ? (
            <View className="gap-3">
              {data.payments.map((payment: Payment) => (
                <View
                  key={payment.id}
                  className="bg-white rounded-md p-5 shadow-sm border border-gray-100"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4 flex-1">
                      {/* Details */}
                      <View className="flex-1">
                        <Text variant="h2" className="text-[#181114] mb-1">
                          {payment.name}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text
                            variant="h2"
                            className="text-on-surface-variant"
                          >
                            {payment.paidOn}
                          </Text>
                          <Text variant="h2" className="text-gray-300">
                            •
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <Text variant="h2" className="text-gray-500">
                              {payment.mode === "bank_transfer"
                                ? "Bank Transfer"
                                : "Credit Card"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text variant="h2" className="text-[#181114] mb-2">
                        Rs. {payment?.amount?.toLocaleString()}
                      </Text>
                      <View className="bg-emerald-100 px-2 py-0.5 rounded-lg">
                        <Text
                          variant="h2"
                          className="text-emerald-700 uppercase text-xs"
                        >
                          {payment.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-end items-center gap-2 mt-3">
                    <TouchableOpacity
                      onPress={() => handleEditPayment(payment.id)}
                      className="flex-row items-center gap-1 px-3 py-1.5 bg-blue-100 rounded-full"
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="edit" size={16} color="#2563eb" />
                      <Text className="text-xs text-blue-700" variant="h2">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeletePayment(payment.id)}
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
            <View className="bg-white rounded-3xl p-8 items-center gap-3 border border-dashed border-gray-200">
              <MaterialIcons name="add-card" size={40} color="#d1d5db" />
              <Text variant="h2" className="text-gray-500 text-center">
                No payments yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute right-5 bottom-8 flex-row items-center gap-2 px-6 py-3 rounded-full bg-[#ee2b8c] shadow-lg active:opacity-80"
        activeOpacity={0.8}
        onPress={handleAddPaymentPress}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text className="text-white text-xs  tracking-tight" variant="h2">
          Add Payment
        </Text>
      </TouchableOpacity>
    </View>
  );
}
