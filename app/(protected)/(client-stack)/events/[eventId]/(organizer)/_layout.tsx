import { Stack } from "expo-router";

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
