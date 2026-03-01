import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
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
            <View style={[styles.badge, styles.typeBadge]}>
              <Text style={styles.badgeText}>{type}</Text>
            </View>
            <View style={[styles.badge, styles.ratingBadge]}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.badgeText}>{rating}</Text>
            </View>
          </>
        }
      >
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{capacity}</Text>
          </View>
          <Text style={styles.price}>{price}</Text>
        </View>
      </ImageCard>
    );
  }
);

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  typeBadge: {
    left: 12,
  },
  ratingBadge: {
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
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
    flex: 1,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ee2b8c",
  },
});

export default VenueCard;
