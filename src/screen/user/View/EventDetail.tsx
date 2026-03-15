import ToggleBar from "@/src/components/ui/ToggleBar";
import { Event } from "@/src/constants/event";
import { useGetEventWithRole } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
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
      role: "Organizer",
      status: "upcoming",
    } as Event);

  const manageActions = [
    {
      id: "guests",
      name: "Guest List",
      icon: "people",
      route: "./guests",
    },

    {
      id: "budget",
      name: "Budget",
      icon: "wallet",
      route: "./budget",
    },
    {
      id: "subevents",
      name: "Sub Events",
      icon: "layers-outline",
      route: "./sub-event",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <EventDetailHero
        imageUrl={event.imageUrl}
        status={event.status}
        title={event.title}
        date={event.date}
        location={event.location}
      />

      <View className="px-4 -mt-6 items-center">
        {/* Checklist */}
        <TouchableOpacity className="bg-white p-5 rounded-xl border border-gray-200 mb-4">
          
        </TouchableOpacity>

        {/* Invite Partner */}
        <TouchableOpacity
          className="bg-white p-4 rounded-xl border border-primary flex-row items-center justify-between mb-4"
          onPress={() => router.push("./addguest" as RelativePathString)}
        >
          <View>
            <Text className="text-gray-800 font-medium">
              Invite your partner to plan together
            </Text>
            <Text className="text-primary mt-1">Invite your partner</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        {/* Grid */}
        <View className="flex-row flex-wrap justify-between">
          {manageActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => router.push(action.route as RelativePathString)}
              className="w-[48%] bg-white rounded-xl p-4 mb-4 border border-gray-200"
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-3">
                <Ionicons name={action.icon as any} size={18} color="#555" />
              </View>

              <Text className="font-semibold text-gray-900">{action.name}</Text>
            </TouchableOpacity>
          ))}

          {/* Gallery */}
          <ToggleBar
            title="Gallery"
            description="Upload & Share Photos"
            iconstring="images"
            onPress={() => {
              router.push("./gallery" as RelativePathString);
            }}
          />

          {/* Event Details */}
          <ToggleBar
            title="Event Details"
            description="Complete Event Information"
            iconstring="create"
            onPress={() => {
              router.push("./" as RelativePathString);
            }}
          />
        </View>

        {/* Favourites */}
        <View className="bg-white rounded-xl p-4 border border-gray-200 mt-2">
          <Text className="font-semibold text-gray-800">Favourites</Text>
        </View>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
};

export default EventDetail;
