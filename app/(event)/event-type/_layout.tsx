import { Stack } from "expo-router";

export default function EventTypeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="wedding" options={{ headerShown: true, headerTitle: 'Wedding' }} />
      <Stack.Screen name="birthday" options={{ headerShown: true, headerTitle: 'Birthday' }} />
      <Stack.Screen name="corporate" options={{ headerShown: true, headerTitle: 'Corporate' }} />
      <Stack.Screen name="workshop" options={{ headerShown: true, headerTitle: 'Workshop' }} />
      <Stack.Screen name="music" options={{ headerShown: true, headerTitle: 'Music' }} />
    </Stack>
  );
}
