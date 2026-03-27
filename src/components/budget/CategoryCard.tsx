import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface CategoryCardProps {
  id: number;
  name: string;
  allocatedBudget: number;
  spend: number;
  icon?: string;
  onPress?: () => void;
}

const CATEGORY_ICONS: Record<
  string,
  { icon: string; bg: string; color: string }
> = {
  "Venue & Site": {
    icon: "location-on",
    bg: "bg-emerald-50",
    color: "text-emerald-500",
  },
  Catering: {
    icon: "restaurant",
    bg: "bg-orange-50",
    color: "text-orange-500",
  },
  Apparel: { icon: "checkroom", bg: "bg-purple-50", color: "text-purple-500" },
  "Flowers & Decor": {
    icon: "local-florist",
    bg: "bg-rose-50",
    color: "text-rose-500",
  },
  Photography: { icon: "camera-alt", bg: "bg-blue-50", color: "text-blue-500" },
  Entertainment: {
    icon: "music-note",
    bg: "bg-indigo-50",
    color: "text-indigo-500",
  },
  Transportation: {
    icon: "directions-car",
    bg: "bg-cyan-50",
    color: "text-cyan-500",
  },
  Other: { icon: "more-horiz", bg: "bg-gray-50", color: "text-gray-500" },
};

function getStatusColor(percentage: number): {
  bg: string;
  text: string;
  indicator: string;
} {
  if (percentage >= 100)
    return {
      bg: "bg-rose-50",
      text: "text-rose-600",
      indicator: "bg-rose-500",
    };
  if (percentage >= 80)
    return {
      bg: "bg-amber-50",
      text: "text-amber-600",
      indicator: "bg-amber-500",
    };
  return {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    indicator: "bg-emerald-500",
  };
}

export function CategoryCard({
  id,
  name,
  allocatedBudget,
  spend,
  onPress,
}: CategoryCardProps) {
  const percentage = allocatedBudget > 0 ? (spend / allocatedBudget) * 100 : 0;
  const statusColor = getStatusColor(percentage);
  const categoryIcon = CATEGORY_ICONS[name] || CATEGORY_ICONS["Other"];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="flex-row items-center gap-6 py-4 flex-1">
          <View
            className={`w-12 h-12 rounded-xl ${categoryIcon.bg} flex items-center justify-center`}
          >
            <MaterialIcons
              name={categoryIcon.icon as any}
              size={24}
              color={categoryIcon.color.replace("text-", "")}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base text-[#181114]" variant="h2">
              {name}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">
              Allocated: Rs. {allocatedBudget.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Right: Status Badge */}
        <View className={`px-3 py-1.5 rounded-lg ${statusColor.bg}`}>
          <Text className={`text-xs font-bold ${statusColor.text}`}>
            {Math.min(Math.round(percentage), 100)}%
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-1.5 w-full bg-gray-100">
        <View
          className={`h-full rounded-full ${statusColor.indicator}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </View>
    </TouchableOpacity>
  );
}
