import { BudgetStatsGrid } from "@/src/components/budget";
import { Text } from "@/src/components/ui/Text";
import { useExpenseById } from "@/src/features/budget/hooks/use-budget";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
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
                <TouchableOpacity
                  key={payment.id}
                  activeOpacity={0.7}
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
                </TouchableOpacity>
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
