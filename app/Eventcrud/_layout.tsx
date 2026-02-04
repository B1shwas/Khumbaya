import { Stack } from "expo-router";

export default function EventCrudLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select-event-type" options={{ headerShown: true, headerTitle: 'Select Event Type' }} />
      <Stack.Screen name="create-event" options={{ headerShown: true, headerTitle: 'Create Event' }} />
      <Stack.Screen name="create-event-form" options={{ headerShown: true, headerTitle: 'Event Details' }} />
      <Stack.Screen name="create-event-datetime" options={{ headerShown: true, headerTitle: 'Date & Time' }} />
      <Stack.Screen name="create-event-location" options={{ headerShown: true, headerTitle: 'Location & Privacy' }} />
      <Stack.Screen name="create-event-success" options={{ headerShown: false }} />
    </Stack>
  );
}
