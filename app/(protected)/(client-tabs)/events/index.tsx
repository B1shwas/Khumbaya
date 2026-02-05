import { Text } from "@/src/components/ui/Text";
import { View } from "react-native";

export default function EventsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-2xl font-bold">Events</Text>
      <Text className="text-gray-600 mt-2">Coming soon...</Text>
    </View>
  );
}
