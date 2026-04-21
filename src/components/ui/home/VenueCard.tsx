import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import ImageCard from "./ImageCard";

interface VenueCardProps {
  id: string;
  name: string;
  location: string;
  capacity: string;
  price: string;
  rating: number;
  imageUrl: string;
  type: string;
  testID?: string;
}

const VenueCard = React.memo(
  ({
    id,
    name,
    location,
    capacity,
    price,
    rating,
    imageUrl,
    type,
    testID,
  }: VenueCardProps) => {
    const handlePress = useCallback(() => {
      router.push(`/venue-detail?id=${id}` as RelativePathString);
    }, [id]);

    return (
      <ImageCard
        testID={testID}
        imageUrl={imageUrl}
        onPress={handlePress}
        badge={
          <>
            <View className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/90">
              <Text className="text-xs font-bold text-gray-900">{type}</Text>
            </View>
            <View className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90 flex-row items-center gap-1">
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text className="text-xs font-bold text-gray-900">{rating}</Text>
            </View>
          </>
        }
      >
        <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
          {name}
        </Text>
        <View className="flex-row items-center gap-1 mb-2">
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="people" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-500">{capacity}</Text>
          </View>
          <Text className="text-sm font-bold text-primary">{price}</Text>
        </View>
      </ImageCard>
    );
  }
);

export default VenueCard;
