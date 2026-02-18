import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_left",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="business-information"
        options={{
          title: "Business Information",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="services-pricing"
        options={{
          title: "Services & Pricing",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="vendor-verification"
        options={{
          title: "Vendor Verification",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="privacy-security"
        options={{
          title: "Privacy & Security",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="app-settings"
        options={{
          title: "App Settings",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
