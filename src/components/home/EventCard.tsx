import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
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
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        }
      >
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color="#896175" />
            <Text style={styles.metaText}>{time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={14} color="#896175" />
            <Text style={styles.metaText}>{location}</Text>
          </View>
        </View>
      </ImageCard>
    );
  },
);

const styles = StyleSheet.create({
  dateBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
});

export default EventCard;
