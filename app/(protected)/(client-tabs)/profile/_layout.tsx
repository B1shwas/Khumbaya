import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import Pressable from "react-native-gesture-handler/lib/typescript/components/Pressable";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        
        options={{
          headerShown: true,
          headerTitle: "My Profile",
          animation: "fade",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen name="family-members" />

      <Stack.Screen
        name="family-options"
        options={{
          presentation: "formSheet",
          headerShown: false,
          sheetAllowedDetents: [0.5],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
