import { useAuth } from "@/src/store/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(client-tabs)" />
      <Stack.Screen name="(vendor-tabs)" />
    </Stack>
  );
}
