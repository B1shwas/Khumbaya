import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onPress?: () => void;
  className?: string;
}

export const ActionButton = ({
  icon,
  label,
  onPress,
  className = "",
}: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-gray-100 px-4 py-2 rounded-full flex-row items-center mr-2 ${className}`}
      activeOpacity={0.7}
    >
      {icon}
      <Text className="ml-1 text-sm text-gray-700">{label}</Text>
    </TouchableOpacity>
  );
};
