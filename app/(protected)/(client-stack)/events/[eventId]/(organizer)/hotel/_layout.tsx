import { Stack } from "expo-router";

export default function HotelManagementLayout() {
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
      <Stack.Screen name="index" options={{ title: "Hotel Management" }} />
    </Stack>
  );
}
