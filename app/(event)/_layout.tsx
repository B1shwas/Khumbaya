import { Stack } from "expo-router";

export default function EventLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="event-budget" options={{ headerShown: true, headerTitle: 'Budget' }} />
      <Stack.Screen name="event-vendors" options={{ headerShown: true, headerTitle: 'Vendors' }} />
      <Stack.Screen name="event-timeline" options={{ headerShown: true, headerTitle: 'Timeline' }} />
      <Stack.Screen name="event-guests" options={{ headerShown: true, headerTitle: 'Guests' }} />
      <Stack.Screen name="event-photos" options={{ headerShown: true, headerTitle: 'Photos & Videos' }} />
    </Stack>
  );
}
