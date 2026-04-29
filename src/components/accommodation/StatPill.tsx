import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
export function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: number;
  label: string;
  color: string;
}) {
  return (
    <View className="flex-1 items-center">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mb-1.5"
        style={{ backgroundColor: `${color}18` }}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text className="font-jakarta-extrabold text-lg" style={{ color }}>
        {value}
      </Text>
      <Text className="font-jakarta text-[10px] text-gray-400 mt-0.5">{label}</Text>
    </View>
  );
}
