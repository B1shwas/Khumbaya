import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
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
  onPress?: () => void;
}

const fmt = (n: number) => (n === 0 ? "$0" : `${n.toLocaleString("en-US")}`);

export function CategorySection({ cat, onPress }: CategorySectionProps) {
  return (
    <View className="mb-8">
      {/* header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name={cat.icon as any} size={20} color="#ee2b8c" />
          <Text className="text-base font-bold text-[#181114]">
            {cat.label}
          </Text>
        </View>
        {cat.total !== undefined && (
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-gray-500">
              {fmt(cat.total)} Total
            </Text>
          </View>
        )}
      </View>
      {/* card */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100"
      >
        {/* table header */}
        <View className="flex-row bg-gray-50 px-5 py-2">
          <Text className="flex-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Item
          </Text>
          <Text className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Est / Actual
          </Text>
        </View>
        {cat.items.map((item) => (
          <ExpenseRow key={item.id} item={item} />
        ))}
      </TouchableOpacity>
    </View>
  );
}
