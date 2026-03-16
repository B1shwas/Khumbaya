import NavigateComponent from "@/src/components/event/NavigateComponent";
import ToggleBar from "@/src/components/ui/ToggleBar";
import { Event } from "@/src/constants/event";
import { useGetEventWithRole } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter
} from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import EventDetailHero from "./EventDetailHero";

const EventDetail = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { data: found } = useGetEventWithRole();
  const foundEvent = found?.find(
    (e: Event) => String(e.id) === String(eventId)
  );

  const event =
    foundEvent ??
    ({
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
    } as Event);

  const manageActions = [
    {
      id: "timeline",
      name: "Timeline",
      icon: "time",
      color: "#F59E0B",
      route: `./timeline`,
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
      id: "tables",
      name: "Table Plan",
      icon: "tablet-landscape",
      color: "#EC4899",
      route: `../(table)/table-management`,
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
        date={event.date}
        location={event.location}
      />


      {/* Main Navigation Grid */}
      <View className="  mt-6 px-4 pb-4">
        {/* dark:text-white removed */}
        <Text className="text-lg font-bold mb-3">Manage Event</Text>
        <View className="flex-row flex-wrap gap-3 justify-center">
          {manageActions.map((action) => (
            <NavigateComponent key={action.id} {...action} />
          ))}

          {/* Gallery - Full Width */}
          {/* Component with the Titleicon and the description Gallery , Upload & Share photos */}
          <ToggleBar title="Gallery" description="Upload & Share Photos" iconstring="images" onPress={() => {
            router.push("./gallery" as RelativePathString)
          }} />
          <ToggleBar title="Event Details" description="Complete Event Information" iconstring="create" onPress={() => {
            router.push("./" as RelativePathString)
          }} />
        </View>
      </View>

      {/* Bottom spacer */}
      <View className="h-24" />
    </ScrollView>
  );
};

export default EventDetail;
