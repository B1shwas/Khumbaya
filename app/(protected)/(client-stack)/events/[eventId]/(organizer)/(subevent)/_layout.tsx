
import { Stack } from "expo-router";

export default function SubEventLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // or true if you want header
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="[subEventId]" />
    </Stack>
  );
}