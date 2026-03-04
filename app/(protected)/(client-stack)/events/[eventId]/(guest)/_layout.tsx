import { Stack } from "expo-router";

export default function GuestEventLayout() {
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
      <Stack.Screen name="index" options={{ title: "Event Details" }} />
      <Stack.Screen name="rsvp" options={{ title: "RSVP" }} />
      <Stack.Screen name="accommodation" options={{ title: "Accommodation" }} />
    </Stack>
  );
}
