import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string;
  iconName: string;
  accent: string; // bg color for icon circle
  valueCls?: string;
}

export function StatCard({
  label,
  value,
  iconName,
  accent,
  valueCls,
}: StatCardProps) {
  return (
    <View className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mx-1">
      <View className="flex-row items-center gap-1.5 mb-1.5">
        <View
          className="w-6 h-6 rounded-full items-center justify-center"
          style={{ backgroundColor: accent }}
        >
          <MaterialIcons name={iconName as any} size={12} color="#fff" />
        </View>
        <Text className="text-[10px] font-bold text-gray-500">{label}</Text>
      </View>
      <Text
        className={`text-lg font-extrabold ${valueCls ?? "text-[#181114]"}`}
      >
        {value}
      </Text>
    </View>
  );
}
