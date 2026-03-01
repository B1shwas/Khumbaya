import React from "react";
import { Text, View, ViewProps } from "react-native";

interface SectionProps extends ViewProps {
  title: string;
  right?: React.ReactNode;
}

export const Section = ({
  title,
  right,
  children,
  className = "",
  ...props
}: SectionProps) => {
  return (
    <View className={`mb-5 ${className}`} {...props}>
      <View className="flex-row justify-between items-center mb-3 px-1">
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        {right}
      </View>
      {children}
    </View>
  );
};
