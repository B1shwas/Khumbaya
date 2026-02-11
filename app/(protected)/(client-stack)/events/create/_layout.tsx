import { Stack } from "expo-router";

export default function EventLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="event-location" />
      <Stack.Screen name="event-estimates" />
      <Stack.Screen name="subevent-create" />
      <Stack.Screen name="subevent-detail" />
      <Stack.Screen name="table-management" />
      <Stack.Screen name="card-making" />
      <Stack.Screen name="success" />
      {/* CMS Routes */}
    </Stack>
  );
}
