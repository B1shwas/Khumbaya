import { MaterialIcons } from "@expo/vector-icons";
import { Animated, Image, Pressable, Text, View } from "react-native";

type AvatarPickerProps = {
  name: string;
  avatarUri?: string;
  onPick: () => void;
  size?: "small" | "medium" | "large" | "xlarge";
  showEditButton?: boolean;
  showName?: boolean;
};

const SIZES = {
  small: 60,
  medium: 100,
  large: 140,
  xlarge: 180,
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export default function AvatarPicker({
  name,
  avatarUri,
  onPick,
  size = "large",
  showEditButton = true,
  showName = false,
}: AvatarPickerProps) {
  const scale = new Animated.Value(1);
  const dimension = SIZES[size];
  const fontSize = dimension * 0.35;
  const cameraButtonSize = dimension * 0.25;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View className="items-center">
      <Pressable
        onPress={onPick}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="items-center justify-center"
      >
        <Animated.View style={{ position: "relative", transform: [{ scale }] }}>
          <View
            className="bg-pink-100 items-center justify-center overflow-hidden"
            style={{
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            }}
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{
                  width: dimension,
                  height: dimension,
                  borderRadius: dimension / 2,
                  resizeMode: "cover",
                }}
              />
            ) : (
              <Text
                className="text-pink-500 font-bold"
                style={{ fontSize, lineHeight: fontSize * 1.2 }}
              >
                {getInitials(name)}
              </Text>
            )}
          </View>

          {showEditButton && (
            <View
              className="absolute bg-pink-500 items-center justify-center shadow-md"
              style={{
                width: cameraButtonSize,
                height: cameraButtonSize,
                borderRadius: cameraButtonSize / 2,
                right: 0,
                bottom: 0,
              }}
            >
              <MaterialIcons
                name="camera-alt"
                size={cameraButtonSize * 0.5}
                color="#fff"
              />
            </View>
          )}
        </Animated.View>
      </Pressable>

      {showName && (
        <Text
          className="mt-3 text-lg font-semibold text-gray-900 max-w-[200px] text-center"
          numberOfLines={1}
        >
          {name || "User"}
        </Text>
      )}
    </View>
  );
}
