import NavigateComponent from "@/src/components/event/NavigateComponent";
import Row from "@/src/components/ui/RowComponent";
import { Event } from "@/src/constants/event";
import { useGetEventWithRole } from "@/src/features/events/hooks/use-event";
import { useEventStore } from "@/src/features/events/store/useEventStore";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import { RelativePathString, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import EventDetailHero from "./EventDetailHero";

const EventDetail = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { push } = useThrottledRouter();
  const { clearEventDraft, setEventDraft } = useEventStore();
  const { data: found } = useGetEventWithRole();
  const foundEvent = found?.find(
    (e: Event) => String(e.id) === String(eventId)
  );

  const event = foundEvent ?? {
    id: eventId ?? "0",
    title: "Event Details",
    date: "—",
    location: "—",
    venue: "—",
    imageUrl: "",
    role: "Organizer" as const,
    status: "upcoming" as const,
    time: "",
    startDateTime: "",
    endDateTime: "",

    days: 0,
    hours: 0,
    minutes: 0,
    guests: { confirmed: 0, total: 0 },
    budget: { spent: 0, total: 0 },
    tasks: { pending: 0 },
    vendors: { booked: 0, pending: 0 },
    nextTask: "",
  };

  useEffect(() => {
    clearEventDraft();
  }, [clearEventDraft]);

  const manageActions = [
    {
      id: "subevents",
      name: "Sub Events",
      icon: "layers-outline",
      color: "#F97316",
      route: `./(subevent)`,
    },
     {
      id: "guests",
      name: "Guest Management",
      icon: "people",
      color: "#8B5CF6",
      route: `./guests`,
    },

      {
      id: "budget",
      name: "Budget",
      icon: "wallet",
      color: "#10B981",
      route: `./budget`,
    },
      {
      id: "checklist",
      name: "Checklist",
      icon: "checkmark-circle-outline",
      color: "#EC4899",
      route: `./tasklist`,
    },
     {
      id: "catering",
      name: "Catering",
      icon: "restaurant",
      color: "#F43F5E",
      route: `./catering`,
    },
     {
      id: "hotel-management",
      name: "Hotel Management",
      icon: "bed-outline",
      color: "#F59E0B",
      route: `./hotel`,
    },   
   {
      id: "logistics",
      name: "logistics",
      icon: "cube-outline",  // or "cube" for filled
      color: "#10B981",
      route: "./(logistics)"
    },
    {
      id: "vendors",
      name: "Vendors",
      icon: "business",
      color: "#3B82F6",
      route: `./vendor`,
    },

  ];

  return (
    <ScrollView
      className="flex-1 bg-background-light"
      showsVerticalScrollIndicator={false}
    >
      <EventDetailHero
        imageUrl={event.imageUrl}
        status={event.status}
        title={event.title}
        // date={event.date}
        startDateTime={event.startDateTime}
        endDateTime={event.endDateTime}
        location={event.location}
      />

      {/* Main Navigation Grid */}
      <View className="  mt-6 px-4 pb-4">
        {/* dark:text-white removed */}
        <Text className="text-lg font-bold mb-3">Manage Event</Text>
        <View className="flex-row flex-wrap gap-3 justify-center">
          {manageActions.map((action) => (
            <NavigateComponent key={action.id} {...action} className="" />
          ))}

          {/* Gallery - Full Width */}
          {/* Component with the Titleicon and the description Gallery , Upload & Share photos */}
          <Row
            title="Gallery"
            description="Upload & Share Photos"
            iconstring="images"
            onPress={() => {
              push("./gallery" as RelativePathString);
            }}
          />
          <Row
            title="Event Details"
            description="Complete Event Information"
            iconstring="create"
            onPress={() => {
              setEventDraft(event as Event);
              push("./edit-event" as RelativePathString);
            }}
          />
          <Row
            title="Planning Committee"
            description="Add Event Organizers and Collaborators"
            iconstring="person"
            onPress={() => {
              push("./settings/transfer-ownership" as RelativePathString);
            }}
          />
        </View>
      </View>

      {/* Bottom spacer */}
      <View className="h-24" />
    </ScrollView>
  );
};

export default EventDetail;
