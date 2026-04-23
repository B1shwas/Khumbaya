import React, { useCallback } from "react";
import { Image, TouchableOpacity, View } from "react-native";

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
        className="w-72 bg-white rounded-xl overflow-hidden mr-4 shadow-sm"
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View className="h-36 w-full relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {badge}
        </View>
        <View className="p-4">{children}</View>
      </TouchableOpacity>
    );
  }
);

export default ImageCard;
