import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageCard from "./ImageCard";

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  imageUrl: string;
  amenities: string[];
  testID?: string;
}

const HotelCard = React.memo(
  ({
    id,
    name,
    location,
    distance,
    price,
    rating,
    imageUrl,
    amenities,
    testID,
  }: HotelCardProps) => {
    const handlePress = useCallback(() => {
      router.push(`/hotel-detail?id=${id}` as RelativePathString);
    }, [id]);

    return (
      <ImageCard
        testID={testID}
        imageUrl={imageUrl}
        onPress={handlePress}
        badge={
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        }
      >
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text style={styles.locationText}>
            {location} • {distance}
          </Text>
        </View>
        <View style={styles.amenitiesRow}>
          {amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityBadge}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.perNight}>per night</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
      </ImageCard>
    );
  }
);

const styles = StyleSheet.create({
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#6b7280",
  },
  amenitiesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  amenityBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  amenityText: {
    fontSize: 10,
    color: "#6b7280",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  perNight: {
    fontSize: 12,
    color: "#6b7280",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ee2b8c",
  },
});

export default HotelCard;
