import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen name="business" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ headerShown: false }} />
    </Stack>
  );
}
