import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

function SubEventEditButton({
  eventId,
  subEventId,
}: {
  eventId?: string;
  subEventId?: string;
}) {
  const router = useRouter();

  if (!eventId || !subEventId) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(
          `/(protected)/(client-stack)/events/${eventId}/(organizer)/(subevent)/${subEventId}/edit-sub-event`
        )
      }
      style={{ paddingHorizontal: 12 }}
      activeOpacity={0.75}
    >
      <MaterialIcons name="edit" size={22} color="#1f2937" />
    </TouchableOpacity>
  );
}

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
        options={({ route }: any) => ({
          title: "Sub Event Detail",
          headerRight: () => (
            <SubEventEditButton
              eventId={route.params?.eventId as string | undefined}
              subEventId={route.params?.subEventId as string | undefined}
            />
          ),
        })}
      />
      <Stack.Screen
        name="[subEventId]/edit-sub-event"
        options={{ title: "Edit Sub Event" }}
      />
      <Stack.Screen name="index" options={{ title: "Sub Event" }} />
    </Stack>
  );
}
