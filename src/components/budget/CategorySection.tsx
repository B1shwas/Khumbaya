import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

export interface ExpenseItem {
  id: string;
  categoryId: number;
  name: string;
  businessId: number | null;
  estimatedCost: number;
  contractAmount: number;
  spend: number;
  remaining: number;
  nextDueDate: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  eventId: number;
  allocatedBudget: number;
  estimated: number;
  spend: number;
  remaining: number;
  createdAt: Date;
  updatedAt: Date;
  expenses: ExpenseItem[];
}

interface CategorySectionProps {
  cat: ExpenseCategory;
  onItemPress?: (item: ExpenseItem) => void;
}

export function CategorySection({ cat, onItemPress }: CategorySectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg text-[#181114] mb-3 px-5" variant="h2">
        {cat.name}
      </Text>

      <View className="flex-1">
        <View className="flex-row bg-[#f5e6ed] px-5">
          {["expense name", "vendor", "estimated", "actual"].map((name) => (
            <Text
              key={name}
              className="flex-1 py-3 px-3 text-xs text-nowrap text-[#181114]"
              variant="h2"
            >
              {name.toUpperCase()}
            </Text>
          ))}
        </View>

        {cat.expenses.length == 0 && (
          <View className="px-5 py-8 items-center gap-2">
            <MaterialIcons name="receipt-long" size={32} color="#d1d5db" />
            <Text className="text-sm text-gray-400 text-center">
              No expenses yet
            </Text>
            <Text className="text-xs text-gray-300 text-center">
              Add your first expense to get started
            </Text>
          </View>
        )}

        {cat.expenses.length > 0 &&
          cat.expenses.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row px-5 border-b-[1px] border-gray-200`}
            >
              <Text className="flex-1 py-3 px-3 text-sm text-[#181114]">
                {item.name}
              </Text>
              <Text className="flex-1 py-3 px-3 text-sm text-gray-600">
                {item.businessId ? "vendor" : "Grand"}
              </Text>
              <Text className="flex-[0.7] py-3 px-3 text-sm text-gray-600">
                Rs. {item.estimatedCost}
              </Text>
              <Text
                className={`flex-[0.7] py-3 px-3 text-sm ${
                  item.contractAmount === 0 ? "text-gray-400" : "text-[#ee2b8c]"
                }`}
              >
                {item.contractAmount === 0
                  ? "Pending"
                  : `Rs. ${item.contractAmount}`}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}
