import React from "react";
import { Text, View } from "react-native";

interface FeaturePillProps {
  icon: React.ReactNode;
  text: string;
  color: string;
}

export const FeaturePill: React.FC<FeaturePillProps> = ({
  icon,
  text,
  color,
}) => {
  return (
    <View className="flex-1 mx-1">
      <View className="bg-white rounded-xl p-3.5 items-center border-[1px] border-gray-300">
        <View
          className="w-11 h-11 rounded-xl items-center justify-center mb-2"
          style={{ backgroundColor: color }}
        >
          {icon}
        </View>
        <Text
          className="text-xs font-semibold text-center"
          style={{ color: "#4B5563" }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};
