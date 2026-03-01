import React from "react";
import { View, Text, ViewProps } from "react-native";

interface ListItemProps extends ViewProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}

export const ListItem = ({ icon, label, value, className = "", ...props }: ListItemProps) => {
  return (
    <View 
      className={`flex-row items-start py-3 ${className}`}
      {...props}
    >
      {icon && (
        <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-base font-medium text-gray-900">
          {value || "—"}
        </Text>
      </View>
    </View>
  );
};
