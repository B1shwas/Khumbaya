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

export function ExpenseRow({ item, onPress }: ExpenseRowProps) {
  const dim = item.pending;
  const total = item.actual === 0 ? item.estimated : item.actual;

  return (
    <TouchableOpacity className="flex-row items-center pb-4">
      <View className="flex-1 flex-row gap-4">
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
      <View className="flex-row items-center gap-3 ml-2">
        <Text
          className={`text-xs font-semibold ${dim ? "text-gray-300" : "text-gray-600"}`}
        >
          {item.estimated}
        </Text>

        <Text
          className={`text-xs font-semibold ${
            dim ? "text-gray-300" : "text-[#ee2b8c]"
          }`}
        >
          {item.actual === 0 ? "Pending" : item.actual}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
