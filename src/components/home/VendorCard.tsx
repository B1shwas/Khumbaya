import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageCard from "./ImageCard";

interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  imageUrl: string;
  testID?: string;
}

const VendorCard = React.memo(
  ({
    id,
    name,
    category,
    rating,
    reviews,
    price,
    imageUrl,
    testID,
  }: VendorCardProps) => {
    const handlePress = useCallback(() => {
      router.push(`/vendor-detail?id=${id}` as RelativePathString);
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
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.footerRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{reviews} reviews</Text>
          </View>
          <Text style={styles.price}>{price}</Text>
        </View>
      </ImageCard>
    );
  },
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
  category: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ee2b8c",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
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

export default VendorCard;
