import { Pressable } from "react-native";
import { Text } from "../ui/Text";

export function CategoryChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-9 px-5 rounded-full items-center justify-center ${
        isActive ? "bg-primary" : "bg-gray-200/90 border border-gray-100"
      }`}
    >
      <Text className={`text-sm ${isActive ? "text-white" : "text-gray-700"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
