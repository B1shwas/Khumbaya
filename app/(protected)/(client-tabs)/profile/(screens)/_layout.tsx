import { Stack } from "expo-router";

export default function ProfileScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,   // ❌ no header
        animation: "slide_from_right",
      }}
    />
  );
}