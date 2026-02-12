import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { VenueCardProps } from "../types";

export default function VenueCard({
  name,
  location,
  capacity,
  price,
  rating,
  imageUrl,
  type,
}: VenueCardProps) {
  return (
    <TouchableOpacity
      className="flex-none w-[280px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-4"
      onPress={() =>
        router.push({
          pathname: "/venue-detail",
          params: { id: name },
        } as unknown as RelativePathString)
      }
      activeOpacity={0.8}
    >
      <View className="h-36 w-full relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded shadow-sm">
          <Text className="text-xs font-bold text-gray-900">{type}</Text>
        </View>
        <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded shadow-sm flex-row items-center gap-1">
          <Ionicons name="star" size={12} color="#F59E0B" fill="#F59E0B" />
          <Text className="text-xs font-bold text-gray-900">{rating}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text
          className="font-bold text-base text-gray-900 mb-1"
          numberOfLines={1}
        >
          {name}
        </Text>
        <View className="flex-row items-center gap-1 mb-2">
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text className="text-xs text-secondary-content" numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="people" size={14} color="#6B7280" />
            <Text className="text-xs text-secondary-content">{capacity}</Text>
          </View>
          <Text className="text-sm font-bold text-primary">{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
