import { EventHighlight } from "@/src/types";
import { formatDate } from "@/src/utils/helper";
import { View } from "react-native";
import { Text } from "../ui/Text";
interface Props {
  highlights: EventHighlight[];
}

const HighlightRow = ({ item }: { item: EventHighlight }) => (
  <View className="flex-row gap-3 mt-4 pl-4">
    {/* Content */}
    <View className="flex-1 pb-5">
      <Text variant="h2" className="text-base">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-500 mt-0.5">
        {formatDate(item.startDateTime)} - {formatDate(item.endDateTime)}
      </Text>
    </View>
  </View>
);

const EventHighlightTimeline = ({ highlights }: Props) => (
  <View>
    {highlights.map((item, index) => (
      <HighlightRow key={item.id} item={item} />
    ))}
  </View>
);

export default EventHighlightTimeline;
