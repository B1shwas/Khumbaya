import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "../ui/Text";

export function FloatLoginBanner() {
  const router = useRouter();
  return (
    <View className="absolute bottom-6 left-4 right-4 p-2">
      <View className="bg-white rounded-xl p-4 flex-row items-center justify-between shadow-lg border border-gray-100">
        <View>
          <Text className="text-sm  text-gray-900" variant="h1">
            Log in to save favorites
          </Text>
          <Text className="text-xs text-gray-500" variant="body">
            Keep track of vendors you love
          </Text>
        </View>

        <Pressable
          className="bg-primary py-2.5 px-6 rounded-md"
          onPress={() => router.push("/login")}
        >
          <Text className="text-white text-sm font-semibold">Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}
