import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_left",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen
        name="business-information"
        options={{ title: "Business Information" }}
      />
      <Stack.Screen
        name="services-pricing"
        options={{ title: "Services & Pricing" }}
      />
      <Stack.Screen name="portfolio" options={{ title: "Portfolio" }} />
      <Stack.Screen
        name="vendor-verification"
        options={{ title: "Vendor Verification" }}
      />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen
        name="privacy-security"
        options={{ title: "Privacy & Security" }}
      />
      <Stack.Screen name="app-settings" options={{ title: "App Settings" }} />
    </Stack>
  );
}
