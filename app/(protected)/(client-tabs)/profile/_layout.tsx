import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Profile Screen - shows header and tab bar */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Profile",
          headerTitle: "My Profile",
          animation: "fade",
        }}
      />

      {/* Inner screens - no header, no tab bar (handled by parent tabs layout) */}
      <Stack.Screen
        name="(screens)"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
