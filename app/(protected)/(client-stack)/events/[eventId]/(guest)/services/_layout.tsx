import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

const headerBackButton = () => (
  <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 8 }}>
    <Ionicons name="arrow-back" size={24} color="#111827" />
  </TouchableOpacity>
);

export default function GuestServicesLayout() {
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
      <Stack.Screen name="logistic" options={{ title: "Logistics" }} />
      <Stack.Screen name="lodge" options={{ title: "Hotel" }} />
      <Stack.Screen name="food" options={{ title: "Meals" }} />
    </Stack>
  );
}
