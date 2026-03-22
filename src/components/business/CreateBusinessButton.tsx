import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CreateBusinessButtonProps {
  onPress?: () => void;
}

const CreateBusinessButton = React.memo(function CreateBusinessButton({
  onPress,
}: CreateBusinessButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="border-2 border-dashed border-gray-200 rounded-xl py-8 items-center justify-center bg-white/50 mb-2"
      onPress={onPress}
    >
      <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mb-2.5">
        <MaterialIcons name="add" size={30} color="#ee2b8c" />
      </View>
      <Text className="text-[15px] font-bold text-[#181114]">
        Create New Business
      </Text>
      <Text className="text-xs text-[#594048] mt-1">
        Grow your portfolio today
      </Text>
    </TouchableOpacity>
  );
});

export default CreateBusinessButton;
