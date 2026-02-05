import { Text } from "@/src/components/ui/Text";
import { cardBase } from "@/src/styles/vendorhome-style";
import React from "react";
import { View } from "react-native";

interface EventItemProps {
  month: string;
  day: string;
  title: string;
  location: string;
  timeLabel?: string;
  opacity?: number;
}

export const EventItem: React.FC<EventItemProps> = ({
  month,
  day,
  title,
  location,
  timeLabel,
  opacity = 1,
}) => {
  return (
    <View
      style={{ opacity }}
      className={`${cardBase} flex-row items-center gap-4 p-3`}
    >
      <View className="w-14 h-14 rounded-lg bg-primary/10 items-center justify-center">
        <Text className="text-xs uppercase text-primary">{month}</Text>
        <Text className="text-xs font-semibold text-primary">{day}</Text>
      </View>

      <View className="flex-1 min-w-0">
        <Text className="text-base text-text-primary" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-sm text-text-secondary" numberOfLines={1}>
          {location}
        </Text>
      </View>

      {timeLabel && (
        <View className="px-2.5 py-1 rounded-md bg-primary/10">
          <Text className="text-xs text-primary">{timeLabel}</Text>
        </View>
      )}
    </View>
  );
};
