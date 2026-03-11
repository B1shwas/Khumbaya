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

      <Stack.Screen name="family-members" />

      <Stack.Screen
        name="family-options"
        options={{
          presentation: "formSheet",
          headerShown: false,
          sheetAllowedDetents: [0.5],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
