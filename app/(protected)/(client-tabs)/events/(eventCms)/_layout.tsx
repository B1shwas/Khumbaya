import { Stack } from "expo-router";

export default function EventCmsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="event-location" />
      <Stack.Screen name="event-estimates" />
      <Stack.Screen name="success" />
      <Stack.Screen name="subevent-create" />
    </Stack>
  );
}
