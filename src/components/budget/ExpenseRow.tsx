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

interface ExpenseRowProps {
  item: ExpenseItem;
  onPress?: () => void;
}

const fmt = (n: number) => (n === 0 ? "$0" : `$${n.toLocaleString("en-US")}`);

export function ExpenseRow({ item, onPress }: ExpenseRowProps) {
  const dim = item.pending;
  const total = item.actual === 0 ? item.estimated : item.actual;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center px-5 py-4 border-b border-gray-100"
    >
      <View className="flex-1">
        <Text
          className={`text-sm font-bold ${dim ? "text-gray-300" : "text-[#181114]"}`}
        >
          {item.name}
        </Text>
        <Text
          className={`text-xs mt-0.5 ${dim ? "text-gray-300" : "text-gray-400"}`}
        >
          {item.vendor}
        </Text>
      </View>
      {/* Est, Actual, Total in horizontal line */}
      <View className="flex-row items-center gap-3 ml-2">
        <View className="items-center">
          <Text
            className={`text-[10px] ${dim ? "text-gray-300" : "text-gray-400"}`}
          >
            Est
          </Text>
          <Text
            className={`text-xs font-semibold ${dim ? "text-gray-300" : "text-gray-600"}`}
          >
            {fmt(item.estimated)}
          </Text>
        </View>
        <View className="w-px h-8 bg-gray-200" />
        <View className="items-center">
          <Text
            className={`text-[10px] ${dim ? "text-gray-300" : "text-gray-400"}`}
          >
            Actual
          </Text>
          <Text
            className={`text-xs font-semibold ${
              dim ? "text-gray-300" : "text-[#ee2b8c]"
            }`}
          >
            {item.actual === 0 ? "Pending" : fmt(item.actual)}
          </Text>
        </View>
        <View className="w-px h-8 bg-gray-200" />
        <View className="items-center">
          <Text
            className={`text-[10px] ${dim ? "text-gray-300" : "text-gray-400"}`}
          >
            Total
          </Text>
          <Text
            className={`text-xs font-bold ${dim ? "text-gray-300" : "text-[#181114]"}`}
          >
            {fmt(total)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
