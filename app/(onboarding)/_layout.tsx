import { useAuth } from "@/src/store/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function OnboardingLayout() {
  const { user, isAuthenticated } = useAuth();

  // If logged in, redirect to protected area based on role
  if (isAuthenticated && user) {
    if (user.role === "vendor") {
      return <Redirect href="/(protected)/(vendor-tabs)/home" />;
    }
    return <Redirect href="/(protected)/(client-tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="explore-vendors" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
