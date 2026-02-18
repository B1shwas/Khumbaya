import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type CardProps = {
  title: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export default function Card({ title, value, icon }: CardProps) {
  return (
    <View className="flex-1 bg-white p-4 rounded-2xl">
      <MaterialIcons name={icon} size={22} color="#ee2b8c" />
      <Text className="text-gray-400 text-xs mt-2">{title}</Text>
      <Text className="font-bold text-xl mt-1">{value}</Text>
    </View>
  );
}
