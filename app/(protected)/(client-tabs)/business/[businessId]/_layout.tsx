import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function BusinessDetailedLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
       
      }}
    >
      <Stack.Screen
        name="detailed"
        options={{ title: "Business Details" }}
      />
      <Stack.Screen
        name="edit"
        options={{ title: "Edit Business" }}
      />
     
    
    </Stack>
  );
}
