import { Stack } from "expo-router";

export default function SubEventLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // or true if you want header
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="[subEventId]/sub-event-detail"
        options={{ title: "Sub Event Detail" }}
      />
      <Stack.Screen
        name="index"
        options={{ title: "Sub Event" }}
      />
    </Stack>
  );
}
