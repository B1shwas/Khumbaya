import { Text, View } from "react-native";

interface KPICardProps {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export default function KPICard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: KPICardProps) {
  return (
    <View className="flex-1 bg-white rounded-md p-4 border border-zinc-100 flex-row items-center gap-3">
      <View className={`w-10 h-10 rounded-md items-center justify-center ${iconBg}`}>
        <Text className={`text-xl ${iconColor}`}>{icon}</Text>
      </View>
      <View>
        <Text className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
          {label}
        </Text>
        <Text className="text-lg font-extrabold text-zinc-900 leading-tight">
          {value}
        </Text>
      </View>
    </View>
  );
}
