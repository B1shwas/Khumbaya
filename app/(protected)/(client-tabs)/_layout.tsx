import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Routes where tab bar should be hidden (inner screens)
const TAB_BAR_HIDDEN_ROUTES = [
  "/profile/edit-profile",
  "/profile/notifications",
  "/profile/app-settings",
  "/profile/change-password",
  "/profile/privacy-security",
  "/profile/business-information",
  "/profile/vendor-verification",
  "/profile/services-pricing",
  "/profile/portfolio",
  "/profile/analytics",
];

export default function ClientTabsLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [hideTabBar, setHideTabBar] = useState(false);

  // Hide tab bar for profile inner screens
  useEffect(() => {
    // Check if current route matches any inner screen route
    const isInnerScreen = TAB_BAR_HIDDEN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );

    setHideTabBar(isInnerScreen);
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ee2b8c",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarShowLabel: true,
        tabBarStyle: {
          display: hideTabBar ? "none" : "flex",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: "#ffffff",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clientexplore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="explore" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
