import { Event } from "@/src/constants/event";
import { useGetEventWithRole } from "@/src/features/events/hooks/use-event";
import { Redirect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function EventRoleRedirect() {
  const { eventId } = useLocalSearchParams();
  const { data: eventsData = [], isLoading, isFetching } = useGetEventWithRole();

  if (isLoading || isFetching) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#ee2b8c" />
      </View>
    );
  }

  const event = eventsData.find((e: Event) => String(e.id) === String(eventId));
  const role = event?.role;

  if (!role) {
    return <Redirect href="/(protected)/(client-tabs)/events" />;
  }

  switch (role) {
    case "Organizer":
      return (
        <Redirect
          href={`/(protected)/(client-stack)/events/${eventId}/(organizer)/`}
        />
      );
    case "Vendor":
      return (
        <Redirect
          href={`/(protected)/(client-stack)/events/${eventId}/(vendor)/`}
        />
      );
    case "Guest":
      return (
        <Redirect
          href={`/(protected)/(client-stack)/events/${eventId}/(guest)/`}
        />
      );
    default:
      return <Redirect href="/(protected)/(client-tabs)/events" />;
  }
}
