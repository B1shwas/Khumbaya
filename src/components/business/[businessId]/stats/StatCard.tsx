import { Text } from "@/src/components/ui/Text";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
export  function StatCard({
  label,
  value,
  iconName,
  iconColor,
  bgColor,
}: {
  label: string;
  value: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <View
      className="flex-1 rounded-md p-3 border border-gray-100"
      style={[shadowStyle, { backgroundColor: bgColor }]}
    >
      <MaterialIcons name={iconName} size={20} color={iconColor} />
      <Text
        variant="h1"
        className="text-lg mt-1"
        style={{ color: iconColor }}
      >
        {value}
      </Text>
      <Text
        variant="caption"
        className="text-[10px] text-[#594048] mt-0.5"
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}


