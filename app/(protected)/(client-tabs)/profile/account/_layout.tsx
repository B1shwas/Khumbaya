import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen
        name="privacy-security"
        options={{ title: "Privacy & Security" }}
      />
      <Stack.Screen name="app-settings" options={{ title: "App Settings" }} />
    </Stack>
  );
}
