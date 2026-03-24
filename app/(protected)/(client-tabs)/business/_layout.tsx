import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function BusinessLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "800",
          color: "#181114",
        },
        headerShadowVisible: true,
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={{ marginLeft: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color="#181114" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Business Detail" }}
      />
      <Stack.Screen
        name="create"
        options={{ title: "Create Business" }}
      />
      <Stack.Screen
        name="[businessId]"
        options={{ title: "Business Details" }}
      />
    </Stack>
  );
}
