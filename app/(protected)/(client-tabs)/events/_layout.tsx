import { Stack } from "expo-router";

export default function EventLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[eventId]" />
      <Stack.Screen name="timeline" />
      <Stack.Screen name="budget" />
      <Stack.Screen name="guests" />
      <Stack.Screen name="gallery" />
      {/* CMS Routes */}
      <Stack.Screen name="create" />
      <Stack.Screen name="event-location" />
      <Stack.Screen name="event-estimates" />
      <Stack.Screen name="subevent-create" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
