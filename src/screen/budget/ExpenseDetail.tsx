import { BudgetStatsGrid, PaymentHistoryCard } from "@/src/components/budget";
import { Text } from "@/src/components/ui/Text";
import {
  useDeletePaymentMutation,
  useExpenseById,
} from "@/src/features/budget/hooks/use-budget";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

type Expense = {
  id: number;
  categoryId: number;
  name: string;
  businessId: number | null;
  estimatedCost: number | null;
  contractAmount: number | null;
  nextDueDate: Date | null;
  notes: string;
  spend: number | null;
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
  const { mutate: deletePayment, isPending: isDeleting } =
    useDeletePaymentMutation(
      Number(expenseId),
      Number(categoryId),
      Number(eventId)
    );

  let remainingBalance,
    dueBalance,
    percentPaid = null;
  if (!isLoading) {
    const estimatedCost = data.estimatedCost ?? 0;
    const spend = data.spend ?? 0;
    const contractAmount = data.contractAmount ?? 0;

    remainingBalance = estimatedCost - spend;
    dueBalance = contractAmount ? contractAmount - spend : null;

    if (contractAmount) {
      percentPaid = Math.round((spend / contractAmount) * 100);
    }
  }

  const handleAddPaymentPress = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/${categoryId}/${expenseId}/add-payment`
    );
  };

  const handleEditPayment = (payment: Payment) => {
    router.push({
      pathname:
        "/(protected)/(client-stack)/events/[eventId]/(organizer)/[categoryId]/[expenseId]/add-payment" as any,
      params: {
        eventId: eventId as string,
        categoryId: categoryId as string,
        expenseId: expenseId as string,
        paymentId: payment.id.toString(),
        paymentName: payment.name,
        amount: payment.amount.toString(),
        paidOn: payment.paidOn,
        mode: payment.mode,
        status: payment.status,
        notes: payment.notes || "",
      },
    });
  };

  const handleDeletePayment = (paymentId: number) => {
    Alert.alert(
      "Delete Payment",
      "Are you sure you want to delete this payment? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePayment(paymentId, {
              onSuccess: () => {
                Alert.alert("Success", "Payment deleted successfully");
              },
              onError: (error: any) => {
                const errorMessage =
                  error?.response?.data?.message ||
                  "Failed to delete payment. Please try again.";
                Alert.alert("Error", errorMessage);
              },
            });
          },
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
                <PaymentHistoryCard
                  key={payment.id}
                  id={payment.id}
                  name={payment.name}
                  amount={payment.amount}
                  paidOn={payment.paidOn}
                  mode={payment.mode}
                  status={payment.status}
                  onEdit={() => handleEditPayment(payment)}
                  onDelete={handleDeletePayment}
                  isDeleting={isDeleting}
                />
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
