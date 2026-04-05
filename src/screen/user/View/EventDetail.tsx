import NavigateComponent from "@/src/components/event/NavigateComponent";
import Row from "@/src/components/ui/RowComponent";
import { Event } from "@/src/constants/event";
import {
  useDeleteEvent,
  useGetEventWithRole,
} from "@/src/features/events/hooks/use-event";
import { useEventStore } from "@/src/features/events/store/useEventStore";
import { Ionicons } from "@expo/vector-icons";
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EventDetailHero from "./EventDetailHero";

const EventDetail = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { clearEventDraft, setEventDraft } = useEventStore();
  const [menuVisible, setMenuVisible] = useState(false);
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

  const eventIdNumber = Number(event.id);
  const { mutate: deleteEvent } = useDeleteEvent(
    Number.isFinite(eventIdNumber) ? eventIdNumber : 0
  );

  const handleEditFromMenu = () => {
    setMenuVisible(false);
    setEventDraft(event as Event);
    router.push("./edit-event" as RelativePathString);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleDeleteFromMenu = () => {
    setMenuVisible(false);

    if (!Number.isFinite(eventIdNumber) || eventIdNumber <= 0) {
      Alert.alert("Delete failed", "Unable to determine current event.");
      return;
    }

    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteEvent(undefined, {
            onSuccess: () => {
              Alert.alert(
                "Event deleted",
                "The event was removed successfully."
              );
              router.push("/(protected)/(client-stack)/events");
            },
            onError: (error: any) => {
              const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete event.";
              Alert.alert("Delete failed", message);
            },
          });
        },
      },
    ]);
  };

  useEffect(() => {
    clearEventDraft();
  }, [clearEventDraft]);

  const manageActions = [
    {
      id: "hotel-management",
      name: "Hotel Management",
      icon: "bed-outline",
      color: "#F59E0B",
      route: `./hotel-management`,
    },
    {
      id: "guests",
      name: "Guest Management",
      icon: "people",
      color: "#8B5CF6",
      route: `./guests`,
    },
    {
      id: "vendors",
      name: "Vendors",
      icon: "business",
      color: "#3B82F6",
      route: `./vendor`,
    },
    {
      id: "budget",
      name: "Budget",
      icon: "wallet",
      color: "#10B981",
      route: `./budget`,
    },
    {
      id: "subevents",
      name: "Sub Events",
      icon: "layers-outline",
      color: "#F97316",
      route: `./sub-event`,
    },
    {
      id: "checklist",
      name: "Checklist",
      icon: "checkmark-circle-outline",
      color: "#EC4899",
      route: `./tasklist`,
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
      <View className="relative mt-6 px-4 pb-4">
        {menuVisible && (
          <Pressable
            onPress={handleCloseMenu}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />
        )}

        <View className="relative mb-3 flex-row items-center justify-between z-20">
          <Text className="text-lg font-bold">Manage Event</Text>
          <TouchableOpacity
            onPress={() => setMenuVisible((current) => !current)}
            className="rounded-full bg-white border border-slate-200 p-2 shadow-sm"
            activeOpacity={0.8}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {menuVisible && (
          <View className="absolute right-4 top-20 z-30 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <TouchableOpacity
              onPress={handleEditFromMenu}
              className="rounded-xl px-3 py-2"
            >
              <Text className="text-sm font-semibold text-slate-900">
                Edit Event
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteFromMenu}
              className="rounded-xl px-3 py-2"
            >
              <Text className="text-sm font-semibold text-red-600">
                Delete Event
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
              router.push("./gallery" as RelativePathString);
            }}
          />
          <Row
            title="Event Details"
            description="Complete Event Information"
            iconstring="create"
            onPress={() => {
              setEventDraft(event as Event);
              router.push("./edit-event" as RelativePathString);
            }}
          />
          <Row
            title="Planning Committee"
            description="Add Event Organizers and Collaborators"
            iconstring="person"
            onPress={() => {
              router.push(
                "./settings/transfer-ownership" as RelativePathString
              );
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
