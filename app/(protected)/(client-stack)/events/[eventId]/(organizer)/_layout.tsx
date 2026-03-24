import { Ionicons } from "@expo/vector-icons";
import { router as expoRouter, Stack, useLocalSearchParams } from "expo-router";
import { Settings } from "lucide-react-native";
import { Pressable, TouchableOpacity } from "react-native";

const headerBackButton = () => (
  <TouchableOpacity
    onPress={() => expoRouter.back()}
    style={{ paddingRight: 8 }}
  >
    <Ionicons name="arrow-back" size={24} color="#111827" />
  </TouchableOpacity>
);
const headerRightButton = (eventId?: string) => {
  return (
    <Pressable
      className="color-primary p-3  "
      onPress={() => {
        if (!eventId) {
          return;
        }
        expoRouter.push({
          pathname:
            "/(protected)/(client-stack)/events/[eventId]/(organizer)/settings",
          params: { eventId },
        });
      }}
    >
      <Settings size={20} />
    </Pressable>
  );
};
export default function OrganizerEventDetailLayout() {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = Array.isArray(params.eventId)
    ? params.eventId[0]
    : params.eventId;

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
        name="index"
        options={{
          title: "Event Detail",
          headerRight: () => headerRightButton(eventId),
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen name="budget" options={{ title: "Budget" }} />
      <Stack.Screen
        name="addBudgetItem"
        options={{ title: "Add Budget Item" }}
      />
      <Stack.Screen
        name="editCategoryBudget"
        options={{ title: "Edit Category" }}
      />
      <Stack.Screen name="gallery" options={{ title: "Gallery" }} />
      <Stack.Screen name="guests" options={{ headerShown: false }} />
      <Stack.Screen name="addguest" options={{ title: "Add Guest" }} />
      <Stack.Screen name="timeline" options={{ title: "Timeline" }} />
      <Stack.Screen name="vendor" options={{ title: "Vendors" }} />
      <Stack.Screen name="sub-event" options={{ title: "Sub Events" }} />
      <Stack.Screen name="edit-event" options={{ title: "Event Details" }} />
      <Stack.Screen
        name="subevent-create"
        options={{ title: "Create new event" }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}
