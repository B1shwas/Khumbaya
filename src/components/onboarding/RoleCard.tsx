import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  iconBg: string;
  onPress?: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  icon,
  title,
  subtitle,
  bgColor,
  iconBg,
  onPress,
}) => {
  return (
    <View className="mb-4">
      <Pressable onPress={onPress}>
        <View
          className="rounded-2xl p-5"
          style={{
            backgroundColor: bgColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: iconBg }}
            >
              {icon}
            </View>

            <View className="flex-1">
              <Text
                className="text-lg font-bold mb-0.5"
                style={{ color: "#111827" }}
              >
                {title}
              </Text>
              <Text className="text-sm" style={{ color: "#4B5563" }}>
                {subtitle}
              </Text>
            </View>

            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            >
              <FontAwesome name="arrow-right" size={14} color="#4B5563" />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
