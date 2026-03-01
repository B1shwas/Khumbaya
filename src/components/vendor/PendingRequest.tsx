import { Text } from "@/src/components/ui/Text";
import { badge, cardBase, mutedText } from "@/src/styles/vendorhome-style";
import React from "react";
import { Image, View } from "react-native";
import { ActionButton } from "./ActionButton";

interface PendingRequestCardProps {
  image: string;
  date: string;
  title: string;
  category: string;
  guests: number;
  onAccept: () => void;
  onDecline: () => void;
}

export const PendingRequestCard: React.FC<PendingRequestCardProps> = ({
  image,
  date,
  title,
  category,
  guests,
  onAccept,
  onDecline,
}) => {
  return (
    <View className={`${cardBase} overflow-hidden`}>
      <View className="relative h-32">
        <Image source={{ uri: image }} className="w-full h-full" />
        <View className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded-md">
          <Text variant="caption">{date}</Text>
        </View>
      </View>

      <View className="p-4 gap-3">
        <View className="flex-row items-start gap-2">
          <Text
            variant="h2"
            className="flex-1 text-base text-text-primary"
            numberOfLines={2}
          >
            {title}
          </Text>

          <Text
            className={`${badge} bg-background-tertiary text-text-secondary`}
          >
            {category}
          </Text>
        </View>

        <Text className={mutedText}>{guests} Guests</Text>

        <View className="flex-row gap-2 pt-1">
          <ActionButton label="Accept" onPress={onAccept} />
          <ActionButton label="Decline" variant="outline" onPress={onDecline} />
        </View>
      </View>
    </View>
  );
};
