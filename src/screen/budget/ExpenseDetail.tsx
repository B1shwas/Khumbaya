import { BudgetStatsGrid } from "@/src/components/budget";
import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface Payment {
  id: number;
  name: string;
  amount: number;
  date: string;
  method: string;
  status: "cleared" | "pending";
}

interface ExpenseDetailsData {
  id: number;
  name: string;
  businessName: string;
  status: "on-track" | "at-risk" | "overbudget";
  estimatedCost: number;
  contractAmount: number;
  amountSpent: number;
  balanceDue: number;
  percentPaid: number;
  payments: Payment[];
}

const mockExpenseData: ExpenseDetailsData = {
  id: 1,
  name: "Royal Chefs Catering",
  businessName: "Royal Chefs",
  status: "on-track",
  estimatedCost: 10000,
  contractAmount: 9500,
  amountSpent: 4000,
  balanceDue: 55000000,
  percentPaid: 42,
  payments: [
    {
      id: 1,
      name: "Initial Deposit",
      amount: 2000,
      date: "Sept 1, 2024",
      method: "bank_transfer",
      status: "cleared",
    },
    {
      id: 2,
      name: "Booking Confirmation",
      amount: 2000,
      date: "Aug 20, 2024",
      method: "credit_card",
      status: "cleared",
    },
  ],
};

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const { eventId, categoryId, expenseId } = useLocalSearchParams();
  const isLoading = false; // Replace with actual loading state

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

  const data = mockExpenseData;

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
                  {data.businessName}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-[#ee2b8c]/10 rounded-md p-6 flex-row items-center gap-4 border border-[#ee2b8c]/70">
            <View>
              <Text
                variant="h2"
                className="text-[#9d1759] uppercase tracking-wider mb-1 text-xs"
              >
                Balance Due
              </Text>
              <Text variant="h1" className="text-[#ee2b8c] text-xl">
                Rs. {data.balanceDue.toLocaleString()}
              </Text>
            </View>

            <View className="h-10 w-px bg-[#ee2b8c]/20" />

            <View className="flex-1 items-center gap-1">
              <View className="h-2 w-24 bg-gray-200 rounded-md overflow-hidden">
                <View
                  className="h-full bg-[#ee2b8c]"
                  style={{ width: `${data.percentPaid}%` }}
                />
              </View>
              <Text variant="h2" className="text-gray-500">
                {data.percentPaid}% Paid
              </Text>
            </View>
          </View>

          <BudgetStatsGrid
            stats={[
              { label: "Estimated", value: 10000000 },
              { label: "Contract", value: 250000 },
              { label: "Spent", value: 300000 },
              { label: "Balance", value: 4000000 },
            ]}
            variant="expense"
          />
        </View>

        {/* Payment History Section */}
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
              {data.payments.map((payment) => (
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
                            {payment.date}
                          </Text>
                          <Text variant="h2" className="text-gray-300">
                            •
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <Text variant="h2" className="text-gray-500">
                              {payment.method === "bank_transfer"
                                ? "Bank Transfer"
                                : "Credit Card"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text variant="h2" className="text-[#181114] mb-2">
                        Rs. {payment.amount.toLocaleString()}
                      </Text>
                      <View className="bg-emerald-100 px-2 py-0.5 rounded-lg">
                        <Text
                          variant="h2"
                          className="text-emerald-700 uppercase text-xs"
                        >
                          {payment.status}
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
