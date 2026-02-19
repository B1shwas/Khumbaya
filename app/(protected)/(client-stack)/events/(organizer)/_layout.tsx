import { Stack } from "expo-router";

export default function OrganizerEventDetailLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="budget" />
      <Stack.Screen name="gallery" />
      <Stack.Screen name="guests" />
      <Stack.Screen name="timeline" />
      <Stack.Screen name="vendor" />
    </Stack>
  );
}
