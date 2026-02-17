import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
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
    </Stack>
  );
}
