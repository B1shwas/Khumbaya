import { Stack } from "expo-router";

export default function ClientStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[eventId]" options={{ headerShown: false }} />
    </Stack>
  );
}
