import { MaterialIcons } from "@expo/vector-icons";
import {
    Animated,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

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
    <View style={styles.container}>
      <Pressable
        onPress={onPick}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.pressable}
      >
        <Animated.View
          style={[styles.avatarWrapper, { transform: [{ scale }] }]}
        >
          <View
            style={[
              styles.avatar,
              {
                width: dimension,
                height: dimension,
                borderRadius: dimension / 2,
              },
            ]}
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={[
                  styles.avatarImage,
                  {
                    width: dimension,
                    height: dimension,
                    borderRadius: dimension / 2,
                  },
                ]}
              />
            ) : (
              <Text
                style={[
                  styles.avatarInitials,
                  { fontSize, lineHeight: fontSize * 1.2 },
                ]}
              >
                {getInitials(name)}
              </Text>
            )}
          </View>

          {showEditButton && (
            <View
              style={[
                styles.cameraButton,
                {
                  width: cameraButtonSize,
                  height: cameraButtonSize,
                  borderRadius: cameraButtonSize / 2,
                  right: 0,
                  bottom: 0,
                },
              ]}
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
        <Text style={styles.nameText} numberOfLines={1}>
          {name || "User"}
        </Text>
      )}

      {!showName && <Text style={styles.hintText}>Tap to upload photo</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  pressable: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    backgroundColor: "#fce7f3",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    resizeMode: "cover",
  },
  avatarInitials: {
    color: "#ec4899",
    fontWeight: "700",
  },
  cameraButton: {
    position: "absolute",
    backgroundColor: "#ec4899",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nameText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    maxWidth: 200,
    textAlign: "center",
  },
  hintText: {
    marginTop: 8,
    fontSize: 13,
    color: "#9ca3af",
  },
});
