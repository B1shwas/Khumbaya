import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "../ui/Text";
import { ExpenseItem, ExpenseRow } from "./ExpenseRow";

export interface ExpenseCategory {
  id: string;
  label: string; // MaterialIcons name
  icon: string;
  total?: number;
  items: ExpenseItem[];
}

interface CategorySectionProps {
  cat: ExpenseCategory;
  onItemPress?: (item: ExpenseItem) => void;
}

const fmt = (n: number) => (n === 0 ? "$0" : `${n.toLocaleString("en-US")}`);

export function CategorySection({ cat, onItemPress }: CategorySectionProps) {
  return (
    <View className="mb-2">
      {/* header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="flex-row items-center">
          <MaterialIcons name={cat.icon as any} size={20} color="#ee2b8c" />
          <Text className="text-base font-bold text-[#181114] ml-2">
            {cat.label}
          </Text>
        </View>
        {cat.total !== undefined && (
          <Text className="text-sm font-bold text-[#181114]">
            {fmt(cat.total)}
          </Text>
        )}
      </View>

      <View className="border-t border-gray-100">
        {cat.items.map((item) => (
          <ExpenseRow
            key={item.id}
            item={item}
            onPress={() => onItemPress?.(item)}
          />
        ))}
      </View>
    </View>
  );
}
