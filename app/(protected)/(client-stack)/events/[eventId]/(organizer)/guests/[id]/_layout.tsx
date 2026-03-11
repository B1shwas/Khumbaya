import { Stack } from "expo-router";

export default function GuestDetailLayout() {
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
     
      <Stack.Screen name="guest-details" options={{ title: "Guest Details" }} />
    </Stack>
  );
}
