import { Ionicons } from "@expo/vector-icons";
import { router as expoRouter, Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";

const headerBackButton = () => (
  <TouchableOpacity
    onPress={() => expoRouter.back()}
    style={{ paddingRight: 8 }}
  >
    <Ionicons name="arrow-back" size={24} color="#111827" />
  </TouchableOpacity>
);

const addMemberButton = (eventId: string) => (
  <TouchableOpacity
    onPress={() =>
      expoRouter.push({
        pathname:
          "/(protected)/(client-stack)/events/[eventId]/(organizer)/addeventmember",
        params: { eventId },
      })
    }
    style={{ paddingLeft: 8 }}
  >
    <Ionicons name="add" size={28} color="#111827" />
  </TouchableOpacity>
);

export default function OrganizerEventDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: headerBackButton,
      }}
    >
      {/* Index Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
          animation: "flip",
          headerRight: () => {
            const params = useLocalSearchParams<{
              eventId?: string | string[];
            }>();
            const eventId = Array.isArray(params.eventId)
              ? params.eventId[0]
              : params.eventId;
            return eventId ? addMemberButton(eventId) : null;
          },
        }}
      />

      {/* Transfer Ownership Screen */}
      <Stack.Screen
        name="transfer-ownership"
        options={{
          title: "Collaboration",
          animation: "flip",
        }}
      />
    </Stack>
  );
}
