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

      {/* Root level profile pages with header */}
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: "#ee2b8c",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: "#ee2b8c",
        }}
      />
      <Stack.Screen
        name="privacy-security"
        options={{
          title: "Privacy & Security",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: "#ee2b8c",
        }}
      />
      <Stack.Screen
        name="app-settings"
        options={{
          title: "App Settings",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: "#ee2b8c",
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: "Change Password",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: "#ee2b8c",
        }}
      />
      <Stack.Screen
        name="business-information"
        options={{
          title: "Business Information",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="services-pricing"
        options={{
          title: "Services & Pricing",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="vendor-verification"
        options={{
          title: "Vendor Verification",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
