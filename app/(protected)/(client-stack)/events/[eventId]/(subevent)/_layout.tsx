import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

const headerBackButton = () => (
  <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 8 }}>
    <Ionicons name="arrow-back" size={24} color="#111827" />
  </TouchableOpacity>
);

export default function SubEventLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "PlusJakartaSans-Bold",
          fontSize: 18,
        },
        headerLeft: headerBackButton,
      }}
    >
      <Stack.Screen
        name="ListSubEvent"
        options={{
          title: "Sub Events",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="subevent-create"
        options={{ title: "Create Sub Event" }}
      />
    </Stack>
  );
}
