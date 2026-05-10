import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function SubEventLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="[subEventId]/sub-event-detail"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="[subEventId]/edit-sub-event"
        options={{ title: "Edit Sub Event" }}

      />
      <Stack.Screen name="index" options={{
        title: "Sub Event",
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <ChevronLeft></ChevronLeft>
          </TouchableOpacity>
        )
      }} />
      <Stack.Screen name="subevent-create" options={{ title: "Create new Sub Event" }} />
    </Stack>
  );
}
