import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

const headerBackButton = () => (
  <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 8 }}>
    <Ionicons name="arrow-back" size={24} color="#111827" />
  </TouchableOpacity>
);

export default function OrganizerEventDetailLayout() {
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
      <Stack.Screen name="index" options={{ title: "Event Details" }} />
      <Stack.Screen name="budget" options={{ title: "Budget" }} />
      <Stack.Screen name="gallery" options={{ title: "Gallery" }} />
      <Stack.Screen name="guests" options={{ headerShown: false }} />
      <Stack.Screen name="addguest" options={{ title: "Add Guest" }} />
      <Stack.Screen name="timeline" options={{ title: "Timeline" }} />
      <Stack.Screen name="vendor" options={{ title: "Vendors" }} />
    </Stack>
  );
}
