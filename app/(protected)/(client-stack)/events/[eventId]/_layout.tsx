import { Stack } from "expo-router";
export default function EventStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(organizer)" options={{ headerShown: false }} />

      <Stack.Screen name="(guest)" options={{ headerShown: false }} />

      <Stack.Screen name="(vendor)" options={{ headerShown: false }} />

      <Stack.Screen name="(subevent)" options={{ headerShown: false }} />
    </Stack>
  );
}
