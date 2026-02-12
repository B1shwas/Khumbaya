import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { ArticleCardProps } from "../types";

export default function ArticleCard({
  id,
  category,
  title,
  description,
  imageUrl,
  readTime,
  categoryColor,
}: ArticleCardProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 p-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 mb-3 h-[14vh]"
      onPress={() => router.push("/blog" as RelativePathString)}
      activeOpacity={0.8}
    >
      <View className="shrink-0 w-[25%] h-[10vh] rounded-lg overflow-hidden">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 gap-1 pr-2 h-[10vh]">
        <View className="flex-row items-center justify-start gap-2">
          <Text
            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${categoryColor}`}
          >
            {category}
          </Text>
          <Text className="text-[10px] text-secondary-content">
            • {readTime}
          </Text>
        </View>
        <View className="mt-2">
          <Text className="font-bold text-md text-gray-900" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-xs text-secondary-content" numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
