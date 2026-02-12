import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import type { QuickServiceButtonProps } from "../types";

export default function QuickServiceButton({
  name,
  icon,
  color,
  route,
}: QuickServiceButtonProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-2 px-4 py-3 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100"
      onPress={() => router.push(route as RelativePathString)}
      activeOpacity={0.8}
      style={{ width: "47%" }}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon as any} size={20} color="white" />
      </View>
      <Text className="font-semibold text-sm text-gray-900">{name}</Text>
    </TouchableOpacity>
  );
}
