import { Text } from "@/src/components/ui/Text";
import { CateringPlan } from "@/src/features/catering/types";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface CateringPlanCardProps {
  item: CateringPlan;
  onPress?: () => void;
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }
  return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export default function CateringPlanCard({
  item,
  onPress,
}: CateringPlanCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="rounded-3xl bg-white p-5 mb-4 border border-outline-variant/40"
      style={shadowStyle}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 pr-2">
          <Text className="text-xl font-black text-on-surface mb-1">
            {item.name}
          </Text>
          <Text className="text-sm text-muted-light mb-1">
            {item.meal_type} experience
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-[11px] font-black text-primary uppercase tracking-[1px]">
                {item.meal_type}
              </Text>
            </View>
            <View className="rounded-full bg-surface-container-high px-3 py-1">
              <Text className="text-[11px] font-bold text-on-surface-variant">
                {item.menus?.length ?? 0} menu items
              </Text>
            </View>
          </View>
        </View>
        <View className="items-end">
          <MaterialIcons name="restaurant" size={24} color="#ee2b8c" />
          <Text className="text-xs font-bold text-muted-light mt-1">
            ₹{item.per_plate_price}
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-[13px] font-bold text-muted-light uppercase tracking-[1.5px] mb-2">
          Schedule
        </Text>
        <Text className="text-sm text-on-surface">
          Start: {formatDateTime(item.startDateTime)}
        </Text>
        <Text className="text-sm text-on-surface mt-1">
          End: {formatDateTime(item.endDateTime)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-outline-variant/30">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="menu-book" size={18} color="#896175" />
          <Text className="text-sm font-medium text-muted-light">
            Menu count
          </Text>
        </View>
        <Text className="text-sm font-bold text-on-surface">
          {item.menus?.length ?? 0}
        </Text>
      </View>
    </Pressable>
  );
}
