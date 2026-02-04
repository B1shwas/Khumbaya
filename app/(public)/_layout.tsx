import { useAuth } from "@/src/store/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  // If logged in, redirect to protected area
  if (isAuthenticated) {
    return <Redirect href={"/home" as any} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore-vendors" />
    </Stack>
  );
}
