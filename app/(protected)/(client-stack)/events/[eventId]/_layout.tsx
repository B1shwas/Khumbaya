import { Stack } from "expo-router";
export default function EventStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Role-based redirect */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Organizer — has its own nested _layout Stack (index + budget, gallery, guests, timeline, vendor) */}
      <Stack.Screen name="(organizer)" options={{ headerShown: false }} />
      {/* Guest — has its own nested _layout Stack (index + rsvp) */}
      <Stack.Screen name="(guest)" options={{ headerShown: false }} />
      {/* Vendor — has its own nested _layout Stack (index) */}
      <Stack.Screen name="(vendor)" options={{ headerShown: false }} />
      {/* Table Management */}
      <Stack.Screen name="(table)" options={{ headerShown: false }} />
      {/* Sub Events */}
      <Stack.Screen name="(subevent)" options={{ headerShown: false }} />
    </Stack>
  );
}
