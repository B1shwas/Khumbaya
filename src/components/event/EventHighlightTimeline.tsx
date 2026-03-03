import { EventHighlight } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  highlights: EventHighlight[];
}

const HighlightRow = ({
  item,
  isLast,
}: {
  item: EventHighlight;
  isLast: boolean;
}) => (
  <View className="flex-row gap-3">
    {/* Timeline axis */}
    <View className="items-center pt-1">
      <View
        className={`items-center justify-center w-8 h-8 rounded-full ${
          item.isFinal ? "bg-primary" : "bg-primary/10"
        }`}
      >
        <Ionicons
          name={item.icon as any}
          size={16}
          color={item.isFinal ? "#fff" : "#ee2b8c"}
        />
      </View>
      {!isLast && (
        <View className="w-[1.5px] bg-gray-200 flex-1 my-1 min-h-[28px]" />
      )}
    </View>

    {/* Content */}
    <View className={isLast ? "flex-1 pb-1" : "flex-1 pb-5"}>
      <Text className="text-base font-semibold text-gray-900">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-500 mt-0.5">{item.dateLabel}</Text>
    </View>
  </View>
);

const EventHighlightTimeline = React.memo(({ highlights }: Props) => (
  <View>
    {highlights.map((item, index) => (
      <HighlightRow
        key={item.id}
        item={item}
        isLast={index === highlights.length - 1}
      />
    ))}
  </View>
));

export default EventHighlightTimeline;
