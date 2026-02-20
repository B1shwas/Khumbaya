import { Stack } from "expo-router";

export default function SubEventLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="subevent-create" />
      <Stack.Screen name="subevent-detail" />
    </Stack>
  );
}
