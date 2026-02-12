import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ArticleCardProps {
  id: string;
  category: string;
  categoryColor?: string;
  title: string;
  description: string;
  imageUrl: string;
  readTime: string;
  testID?: string;
}

const ArticleCard = React.memo(
  ({
    id,
    category,
    categoryColor = "#ee2b8c",
    title,
    description,
    imageUrl,
    readTime,
    testID,
  }: ArticleCardProps) => {
    const handlePress = useCallback(() => {
      router.push("/blog" as RelativePathString);
    }, []);

    return (
      <TouchableOpacity
        testID={testID}
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {category}
            </Text>
            <Text style={styles.readTime}>• {readTime}</Text>
          </View>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryText: {
    backgroundColor: "#ee2b8c20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  readTime: {
    fontSize: 10,
    color: "#6b7280",
  },
  textContent: {
    marginTop: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});

export default ArticleCard;
