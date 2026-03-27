import { InfoIcon } from "@/src/components/ui/InfoIcon";
import { Text } from "@/src/components/ui/Text";
import { useCategoryDetails } from "@/src/features/budget/hooks/use-budget";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
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

  const handleAddExpensePress = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/${categoryId}/add-expense`
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
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-5 mt-5 bg-white rounded-md p-6 shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text
                className="text-[10px]  text-secondary mb-2 uppercase tracking-widest"
                variant="h2"
              >
                Category
              </Text>
              <Text className="text-2xl text-[#181114]" variant="h1">
                {categoryData?.name}
              </Text>
            </View>
            <View className="text-right">
              <Text
                className="text-[10px] text-gray-400 mb-1 uppercase tracking-widest"
                variant="h2"
              >
                Allocated
              </Text>
              <Text className="text-base text-[#181114]" variant="h2">
                Rs. {categoryData.allocatedBudget.toLocaleString()}
              </Text>
            </View>
          </View>

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
              <TouchableOpacity
                key={expense.id}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-row items-start gap-4"
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
                        Rs. {expense.contractAmount.toLocaleString()}
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
        <Text className="text-white text-xs  tracking-tight">Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}
