import { Stack } from "expo-router";
import SubEventEditButton from "../../../../../../../src/components/event/subevent/SubEventEditButton";

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
