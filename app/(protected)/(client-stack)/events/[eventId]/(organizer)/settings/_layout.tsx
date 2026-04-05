import { Stack } from "expo-router";

export default function OrganizerEventDetailLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "PlusJakartaSans-Bold",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Settings", animation: "flip" }}
      />
      <Stack.Screen
        name="transfer-ownership"
        options={{ title: "Collaboration", animation: "flip" }}
      />
    </Stack>
  );
}
