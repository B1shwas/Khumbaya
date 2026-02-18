import { Stack } from "expo-router";
export default function EventStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[eventId]" options={{ headerShown: false }} />
      <Stack.Screen name="(guest)/[eventId]" options={{ headerShown: false }} />
      <Stack.Screen
        name="(organizer)/[eventId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(vendor)/[eventId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
}
