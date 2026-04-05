import { Ionicons } from "@expo/vector-icons";
import { router as expoRouter, Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";

const headerBackButton = () => (
  <TouchableOpacity
    onPress={() => expoRouter.back()}
    style={{ paddingRight: 8 }}
  >
    <Ionicons name="arrow-back" size={24} color="#111827" />
  </TouchableOpacity>
);

export default function OrganizerEventDetailLayout() {
  useLocalSearchParams<{ eventId?: string | string[] }>();

  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "PlusJakartaSans-Bold",
          fontSize: 18,
        },
        headerLeft: headerBackButton,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Settings", animation: "flip" }}
      />
      <Stack.Screen
        name="transfer-ownership"
        options={{ title: "Collaboration", animation: "flip" }}
      />
    </Stack>
  );
}
