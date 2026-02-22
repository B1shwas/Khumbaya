import { useAuthStore } from "@/src/store/AuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import "./global.css";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { token, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(onboarding)";

    if (token && inAuthGroup) {
      // If we have a token and are in onboarding, move to protected
      router.replace("/(protected)/(client-tabs)/home");
    } else if (!token && !inAuthGroup) {
      // If we have no token and are NOT in onboarding, move to onboarding
      router.replace("/(onboarding)");
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {token ? (
        <Stack.Screen name="(protected)" />
      ) : (
        <Stack.Screen name="(onboarding)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      useAuthStore.getState().hydrate().then(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !useAuthStore.getState().isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" backgroundColor={"#ffffff"} />
          <SafeAreaView className="flex-1  " edges={["top", "bottom"]}>
            <RootNavigation />
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
