import { Text } from "@/src/components/ui/Text";
import { cardBase } from "@/src/styles/vendorhome-style";
import React from "react";
import { View } from "react-native";

interface StatsCardProps {
  label: string;
  value: string;
  isPrimary?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  isPrimary = false,
}) => {
  return (
    <View
      className={`min-w-[160px] p-5 gap-1 rounded-xl ${
        isPrimary ? "bg-primary shadow-lg shadow-primary/30" : `${cardBase}`
      } mr-3`}
    >
      <Text
        variant="caption"
        className={isPrimary ? "text-text-inverse/90" : "text-text-secondary"}
      >
        {label}
      </Text>

      <Text
        variant="h1"
        className={`text-xl ${
          isPrimary ? "text-text-inverse" : "text-text-primary"
        }`}
      >
        {value}
      </Text>
    </View>
  );
};
