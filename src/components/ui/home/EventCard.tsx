import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import ImageCard from "./ImageCard";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  testID?: string;
}

const EventCard = React.memo(
  ({ id, title, date, time, location, imageUrl, testID }: EventCardProps) => {
    const handlePress = useCallback(() => {
      router.push("/(protected)/(client-tabs)/events" as RelativePathString);
    }, []);

    return (
      <ImageCard
        testID={testID}
        imageUrl={imageUrl}
        onPress={handlePress}
        badge={
          <View className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90">
            <Text className="text-xs font-bold text-gray-900">{date}</Text>
          </View>
        }
      >
        <Text className="text-base font-bold text-gray-900 mb-2" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time" size={14} color="#896175" />
            <Text className="text-xs text-gray-500">{time}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="location" size={14} color="#896175" />
            <Text className="text-xs text-gray-500">{location}</Text>
          </View>
        </View>
      </ImageCard>
    );
  }
);

export default EventCard;
