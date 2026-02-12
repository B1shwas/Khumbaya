import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { HotelCardProps } from "../types";

export default function HotelCard({
  name,
  location,
  distance,
  price,
  rating,
  imageUrl,
  amenities,
}: HotelCardProps) {
  return (
    <TouchableOpacity
      className="w-64 bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-4"
      onPress={() =>
        router.push({
          pathname: "/hotel-detail",
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
          <Text className="text-xs text-secondary-content">
            {location} • {distance}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 mb-3">
          {amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} className="bg-gray-100 px-2 py-0.5 rounded">
              <Text className="text-[10px] text-secondary-content">
                {amenity}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-secondary-content">per night</Text>
          <Text className="text-sm font-bold text-primary">{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
