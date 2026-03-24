import { Text, View } from "react-native";

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
}

const fmt = (n: number) => (n === 0 ? "$0" : `$${n.toLocaleString("en-US")}`);

export function ExpenseRow({ item }: ExpenseRowProps) {
  const dim = item.pending;
  return (
    <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
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
      <View className="items-end gap-0.5 ml-2">
        <Text className={`text-xs ${dim ? "text-gray-300" : "text-gray-500"}`}>
          Est. {fmt(item.estimated)}
        </Text>
        <Text
          className={`text-sm font-bold ${
            dim ? "text-gray-300" : "text-[#ee2b8c]"
          }`}
        >
          {item.actual === 0 ? "Pending" : fmt(item.actual)}
        </Text>
      </View>
    </View>
  );
}
