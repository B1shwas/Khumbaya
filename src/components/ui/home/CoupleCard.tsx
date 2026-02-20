import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CoupleCardProps {
  id: string;
  names: string;
  date: string;
  location: string;
  imageUrl: string;
  story: string;
  testID?: string;
}

const CoupleCard = React.memo(
  ({ id, names, date, location, imageUrl, story, testID }: CoupleCardProps) => {
    const handlePress = useCallback(() => {
      router.push(`/wedding-story?id=${id}` as RelativePathString);
    }, [id]);

    return (
      <TouchableOpacity
        testID={testID}
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.avatar}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.names}>{names}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar" size={12} color="#896175" />
            <Text style={styles.metaText}>{date}</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Ionicons name="location" size={12} color="#896175" />
            <Text style={styles.metaText}>{location}</Text>
          </View>
          <Text style={styles.story} numberOfLines={2}>
            {story}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  names: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  metaSeparator: {
    color: "#6b7280",
  },
  story: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
});

export default CoupleCard;
