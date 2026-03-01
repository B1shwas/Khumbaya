import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const Collapsible = ({
  title,
  children,
  defaultExpanded = true,
  className = "",
}: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState(!defaultExpanded);

  return (
    <View className={`mb-4 bg-white rounded-xl shadow-sm ${className}`}>
      <TouchableOpacity
        className="px-4 py-3 flex-row justify-between items-center"
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.7}
      >
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Ionicons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {!collapsed && <View className="px-4 pb-4">{children}</View>}
    </View>
  );
};
