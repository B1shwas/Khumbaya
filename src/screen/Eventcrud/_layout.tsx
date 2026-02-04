import { Stack } from "expo-router";

export default function EventCrudLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select-event-type" options={{ headerShown: true, headerTitle: 'Select Event Type' }} />
      <Stack.Screen name="create-event" options={{ headerShown: true, headerTitle: 'Create Event' }} />
      <Stack.Screen name="create-event-form" options={{ headerShown: true, headerTitle: 'Event Details' }} />
    </Stack>
  );
}
