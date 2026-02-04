import { useAuth } from "@/src/store/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Redirect based on auth state and role
  if (isAuthenticated && user) {
    if (user.role === "vendor") {
      return <Redirect href="/(protected)/(vendor-tabs)/home" />;
    }
    return <Redirect href="/(protected)/(client-tabs)/home" />;
  }

  // Not authenticated - go to onboarding
  return <Redirect href="/(onboarding)" />;
}
