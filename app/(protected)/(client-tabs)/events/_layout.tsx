import { Stack } from "expo-router";

export default function EventsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Events",
        }}
      />
      <Stack.Screen
        name="rsvp"
        options={{
          title: "RSVP",
        }}
      />
      <Stack.Screen
        name="vendors"
        options={{
          title: "Vendors",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          title: "Success",
        }}
      />
      <Stack.Screen
        name="gallery"
        options={{
          title: "Gallery",
        }}
      />
      <Stack.Screen
        name="guests"
        options={{
          title: "Guests",
        }}
      />
      <Stack.Screen
        name="table-management"
        options={{
          title: "Table Management",
        }}
      />
      <Stack.Screen
        name="timeline"
        options={{
          title: "Timeline",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Create Event",
        }}
      />
      <Stack.Screen
        name="event-location"
        options={{
          title: "Event Location",
        }}
      />
      <Stack.Screen
        name="event-estimates"
        options={{
          title: "Event Estimates",
        }}
      />
      <Stack.Screen
        name="event-success"
        options={{
          title: "Success",
        }}
      />
      <Stack.Screen
        name="subevent-create"
        options={{
          title: "Create Sub Event",
        }}
      />
      <Stack.Screen
        name="subevent-detail"
        options={{
          title: "Sub Event Details",
        }}
      />
    </Stack>
  );
}
