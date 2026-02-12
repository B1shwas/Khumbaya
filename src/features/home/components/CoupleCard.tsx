import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { CoupleCardProps } from "../types";

export default function CoupleCard({
  names,
  date,
  location,
  imageUrl,
  story,
}: CoupleCardProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 mb-3"
      onPress={() =>
        router.push({
          pathname: "/wedding-story",
          params: { names },
        } as unknown as RelativePathString)
      }
      activeOpacity={0.8}
    >
      <View className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-bold text-base text-gray-900">{names}</Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar" size={12} color="#896175" />
          <Text className="text-xs text-secondary-content">{date}</Text>
          <Text className="text-secondary-content">•</Text>
          <Ionicons name="location" size={12} color="#896175" />
          <Text className="text-xs text-secondary-content">{location}</Text>
        </View>
        <Text className="text-xs text-secondary-content" numberOfLines={2}>
          {story}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
