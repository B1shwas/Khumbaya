import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";

interface CreateBusinessButtonProps {
  onPress?: () => void;
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#ee2b8c",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 8 },
  default: {},
});

const CreateBusinessButton = React.memo(function CreateBusinessButton({
  onPress,
}: CreateBusinessButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        shadowStyle,
        {
          position: "absolute",
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#ee2b8c",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <MaterialIcons name="add" size={30} color="white" />
    </TouchableOpacity>
  );
});

export default CreateBusinessButton;
