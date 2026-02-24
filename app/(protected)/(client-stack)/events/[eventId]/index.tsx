// import { eventsData } from "@/src/constants/event";
import { Event } from "@/src/constants/event";
import { useGetEventWithRole } from "@/src/features/events/hooks/use-event";
import { Redirect, useLocalSearchParams } from "expo-router";
export default function EventRoleRedirect() {
  const { eventId } = useLocalSearchParams();
    const { data: eventsData = [] } = useGetEventWithRole();
    
  const event = eventsData.find((e:Event) => String(e.id) === String(eventId));
  const role = event?.role ||"Organizer"; // Default to Organizer if role is not found
  console.log("Events Data:", event);
  console.log("Event:", eventId, "Role:", role);

  if (!eventsData || !role) {
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
        // Route group syntax in href navigates to (guest)/index.tsx
        <Redirect
          href={`/(protected)/(client-stack)/events/${eventId}/(guest)/`}
        />
      );
    default:
      return <Redirect href="/(protected)/(client-tabs)/events" />;
  }
}
