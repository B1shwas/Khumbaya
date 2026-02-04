import { Text } from "@/src/components/ui/Text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainHome() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-6">
        <Text variant="h1" className="mb-4">
          Main Home (Protected)
        </Text>
        <Text variant="body" className="text-center text-gray-600">
          This is the main home screen for logged-in users.
        </Text>
      </View>
    </SafeAreaView>
  );
}
