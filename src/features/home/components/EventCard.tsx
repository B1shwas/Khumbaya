import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { EventCardProps } from "../types";

export default function EventCard({
  id,
  title,
  date,
  time,
  location,
  imageUrl,
}: EventCardProps) {
  return (
    <TouchableOpacity
      className="flex-none w-[280px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-4"
      onPress={() => router.push("/events")}
      activeOpacity={0.8}
    >
      <View className="h-36 w-full relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded shadow-sm">
          <Text className="text-xs font-bold text-gray-900">{date}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text
          className="font-bold text-base text-gray-900 mb-2"
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time" size={14} color="#896175" />
            <Text className="text-xs text-secondary-content">{time}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="location" size={14} color="#896175" />
            <Text className="text-xs text-secondary-content">{location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
