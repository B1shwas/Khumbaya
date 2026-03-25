import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

export interface ExpenseItem {
  id: string;
  name: string;
  vendor: string;
  estimated: number;
  actual: number;
  pending?: boolean;
}

export interface ExpenseCategory {
  id: string;
  label: string;
  icon: string;
  total?: number;
  items: ExpenseItem[];
}

interface CategorySectionProps {
  cat: ExpenseCategory;
  onItemPress?: (item: ExpenseItem) => void;
}

export function CategorySection({ cat, onItemPress }: CategorySectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg text-[#181114] mb-3 px-5" variant="h2">
        {cat.label}
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

        {cat.items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            className={`flex-row px-5 border-b-[1px] border-gray-200`}
          >
            <Text className="flex-1 py-3 px-3 text-sm text-[#181114]">
              {item.name}
            </Text>
            <Text className="flex-1 py-3 px-3 text-sm text-gray-600">
              {item.vendor}
            </Text>
            <Text className="flex-[0.7] py-3 px-3 text-sm text-gray-600">
              Rs. {item.estimated}
            </Text>
            <Text
              className={`flex-[0.7] py-3 px-3 text-sm ${
                item.actual === 0 ? "text-gray-400" : "text-[#ee2b8c]"
              }`}
            >
              {item.actual === 0 ? "Pending" : `Rs. ${item.actual}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
