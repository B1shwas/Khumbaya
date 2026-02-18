import { eventsData } from "@/src/constants/event";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function EventRoleRedirect() {
  const { eventId } = useLocalSearchParams();

  const event = eventsData.find((e) => String(e.id) === String(eventId));
  const role = event?.role;

  console.log("Event:", eventId, "Role:", role);

  if (!event || !role) {
    return <Redirect href="/(protected)/(client-tabs)/events" />;
  }

  switch (role) {
    case "Organizer":
      return (
        <Redirect
          href={`/(protected)/(client-stack)/events/(organizer)/${eventId}`}
        />
      );
    case "Vendor":
      return (
        <Redirect
          href={`/(protected)/(client-stack)/events/(vendor)/${eventId}`}
        />
      );
    case "Guest":
      return (
        <Redirect
          href={`/(protected)/(client-stack)/events/(guest)/${eventId}`}
        />
      );
    default:
      return <Redirect href="/(protected)/(client-tabs)/events" />;
  }
}
