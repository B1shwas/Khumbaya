import { useAuth } from "@/src/store/AuthContext";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={"/" as any} />;
  }

  return <Slot />;
}
