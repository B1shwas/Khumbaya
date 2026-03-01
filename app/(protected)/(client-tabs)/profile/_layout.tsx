import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* Main Profile Screen - shows header and tab bar */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,

          headerTitle: "My Profile",
          animation: "fade",
          headerTitleAlign: "center",
        }}
      />

      {/* Inner screens - no header, no tab bar (handled by parent tabs layout) */}
      <Stack.Screen
        name="family-members"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          headerTitle: "Family Members",
        }}
      />
    </Stack>
  );
}
