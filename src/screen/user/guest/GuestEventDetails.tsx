import EventHighlightTimeline from "@/src/components/event/EventHighlightTimeline";
import FamilyRsvpCard from "@/src/components/event/FamilyRsvpCard";
import ServiceGrid from "@/src/components/event/ServiceGrid";
import { Text } from "@/src/components/ui/Text";
import {
  useEventById,
  useEventResponseWithUser,
} from "@/src/features/events/hooks/use-event";
import { useRsvpStore } from "@/src/store/useRsvpStore";
import { EventHighlight, EventService } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// this will be replaced by the timelines or we will be creating the highlight (major subevent api)
const DEFAULT_HIGHLIGHTS: EventHighlight[] = [
  {
    id: "1",
    title: "Welcome Brunch",
    dateLabel: "Oct 24  •  11:00 AM  •  Poolside Deck",
    icon: "sparkles-outline",
  },
  {
    id: "2",
    title: "Sangeet Night",
    dateLabel: "Oct 25  •  7:00 PM  •  Ballroom",
    icon: "musical-notes-outline",
  },
  {
    id: "3",
    title: "Main Ceremony",
    dateLabel: "Oct 26  •  6:00 PM  •  Royal Gardens",
    icon: "heart",
    isFinal: true,
  },
];

const DEFAULT_SERVICES: EventService[] = [
  { id: "lodging", label: "Lodging", icon: "bed-outline" },
  { id: "transport", label: "Transport", icon: "car-outline" },
  { id: "meals", label: "Meals", icon: "restaurant-outline" },
];

const Section = ({
  title,
  action,
  onAction,
  children,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) => (
  <View className="px-5 py-5">
    <View className="flex-row items-center justify-between mb-3">
      <Text variant="h2" className="text-xl">
        {title}
      </Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text variant="caption" className="text-primary">
            {action}
          </Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

export default function GuestEventDetails() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const setDraft = useRsvpStore((s) => s.setDraft);

  const { data: eventDetails, isLoading } = useEventById(Number(eventId));
  const { data: eventResponse, isLoading: responseLoading } =
    useEventResponseWithUser(Number(eventId));

  const isFamily = eventResponse?.isFamily ?? false;
  const responses = (eventResponse?.responses ?? []) as Array<{
    event_guest: {
      status: string | null;
      arrival_date_time: string | null;
      departure_date_time: string | null;
      isAccomodation: boolean | null;
      notes: string | null;
    } | null;
    user_detail: {
      id: number;
      username: string;
      photo: string | null;
      relation: string | null;
    };
  }>;

  /**
   * Individual invite: the single guest record for the logged-in user.
   * responses[0] is the only entry when isFamily === false.
   */
  const myGuestRecord = !isFamily ? (responses[0]?.event_guest ?? null) : null;
  const hasRsvped = isFamily ? true : myGuestRecord !== null;

  /**
   * Family invite: derive member list and confirmed count from responses.
   */
  const familyMembers = responses.map((r) => ({
    id: r.user_detail.id.toString(),
    name: r.user_detail.username,
    avatarUrl: r.user_detail.photo ?? undefined,
  }));

  const confirmedCount = responses.filter(
    (r) => r.event_guest?.status === "accepted"
  ).length;

  const familyName = responses[0]?.user_detail?.relation ?? "Your Family";

  if (isLoading || responseLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-light items-center justify-center"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  const handleIndividualRsvp = () => {
    const me = responses[0];
    if (me) {
      setDraft({
        userId: me.user_detail.id,
        memberName: me.user_detail.username,
        rawStatus: me.event_guest?.status ?? null,
        rawArrival: me.event_guest?.arrival_date_time ?? null,
        rawDeparture: me.event_guest?.departure_date_time ?? null,
        rawAccommodation: me.event_guest?.isAccomodation ?? null,
        rawNotes: me.event_guest?.notes ?? null,
      });
    }
    router.push(`/(protected)/(client-stack)/events/${eventId}/(guest)/rsvp`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="items-center pb-2 px-5">
          <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100">
            {eventDetails?.imageUrl ? (
              <Image
                source={{ uri: eventDetails.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-pink-50" />
            )}
          </View>

          <Text variant="h1" className="text-center mt-4 text-lg">
            {eventDetails?.title}
          </Text>

          <View className="flex-row items-center gap-1.5 mt-2">
            <Ionicons name="calendar-outline" size={14} color="#ee2b8c" />
            <Text variant="caption" className="text-primary">
              {eventDetails?.date}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5 mt-1">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text variant="caption">{eventDetails?.location}</Text>
          </View>
        </View>

        {/* ── Highlights ── */}
        <Section
          title="Event Highlights"
          action="View Full Itinerary"
          onAction={() => { }}
        >
          <EventHighlightTimeline highlights={DEFAULT_HIGHLIGHTS} />
        </Section>

        {/* ── Services ── */}
        <Section title="Services Offered">
          <ServiceGrid services={DEFAULT_SERVICES} />
        </Section>

        {/* ── RSVP section ── */}
        <View className="px-5 py-5">
          {isFamily ? (
            <FamilyRsvpCard
              familyName={familyName}
              members={familyMembers}
              confirmedCount={confirmedCount}
              onManage={() =>
                router.push(
                  `/(protected)/(client-stack)/events/${eventId}/(guest)/family-rsvp`
                )
              }
            />
          ) : (
            <View className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name={hasRsvped ? "checkmark-circle" : "mail-outline"}
                  size={20}
                  color={hasRsvped ? "#16a34a" : "#ee2b8c"}
                />
                <Text className="text-lg font-bold text-slate-900">
                  {hasRsvped ? "Your RSVP" : "RSVP to this Event"}
                </Text>
              </View>
              <Text className="text-sm text-slate-500">
                {hasRsvped
                  ? "You have already responded. You can update your RSVP anytime."
                  : "Let the host know if you'll be attending and share your travel details."}
              </Text>
              <TouchableOpacity
                className="w-full py-3 mt-1 rounded-lg items-center justify-center"
                style={{ backgroundColor: "#ee2b8c" }}
                activeOpacity={0.85}
                onPress={handleIndividualRsvp}
              >
                <Text className="text-white font-bold text-base">
                  {hasRsvped ? "Edit Your RSVP" : "Complete Your RSVP"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
