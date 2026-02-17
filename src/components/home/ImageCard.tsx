import React, { useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

interface ImageCardProps {
  imageUrl: string;
  children: React.ReactNode;
  onPress?: () => void;
  badge?: React.ReactNode;
  testID?: string;
}

const ImageCard = React.memo(
  ({ imageUrl, children, onPress, badge, testID }: ImageCardProps) => {
    const handlePress = useCallback(() => {
      if (onPress) {
        onPress();
      }
    }, [onPress]);

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
          {badge}
        </View>
        <View style={styles.content}>{children}</View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 144,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 16,
  },
});

export default ImageCard;
