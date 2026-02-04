import { useAuth } from "@/src/store/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to main app
  if (isAuthenticated) {
    return <Redirect href={"/home" as any} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
