import { Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";

export interface ServiceQueueItem {
  id: string;
  name: string;
  status: "Served" | "Ready" | "Preparing" | "Queued";
  guests: number;
  time: string;
  location: string;
  emoji: string;
}

interface ServiceQueueRowProps {
  item: ServiceQueueItem;
  onPress?: () => void;
}

export default function ServiceQueueRow({ item, onPress }: ServiceQueueRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center px-4 py-3 border-b border-zinc-50"
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View className="w-8 h-8 rounded-md bg-zinc-100 items-center justify-center">
          <Text className="text-base">{item.emoji}</Text>
        </View>
        <Text className="font-bold text-[13px] text-zinc-900 flex-shrink">{item.name}</Text>
      </View>

      <View className="w-24 items-start">
        <StatusBadge status={item.status} />
      </View>

      <View className="w-12 items-center">
        <Text className="text-[12px] font-semibold text-zinc-500">{item.guests}</Text>
      </View>

      <View className="w-20 items-end">
        <Text className="text-[12px] font-bold text-zinc-900">{item.time}</Text>
        <Text className="text-[11px] text-zinc-400">{item.location}</Text>
      </View>
    </TouchableOpacity>
  );
}
