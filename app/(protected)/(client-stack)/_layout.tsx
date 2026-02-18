import { Stack } from "expo-router";

export default function ClientStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="events" options={{ headerShown: false }} />
    </Stack>
  );
}
