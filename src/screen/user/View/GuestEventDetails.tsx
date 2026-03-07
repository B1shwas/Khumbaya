import EventHighlightTimeline from "@/src/components/event/EventHighlightTimeline";
import FamilyRsvpCard from "@/src/components/event/FamilyRsvpCard";
import ServiceGrid from "@/src/components/event/ServiceGrid";
import { Text } from "@/src/components/ui/Text";
import { useGetEventResponses } from "@/src/features/guests/api/use-guests";
import { useAuthStore } from "@/src/store/AuthStore";
import { EventHighlight, EventService } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <View className="flex-row items-center justify-between">
      <Text variant="h2" className=" text-xl">
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
  const user = useAuthStore((state) => state.user);
  const params = useLocalSearchParams<{
    eventId: string;
    title?: string;
    dateRange?: string;
    venue?: string;
    location?: string;
    imageUrl?: string;
    familyName?: string;
  }>();

  const parsedEventId = Number(params.eventId);
  const eventId = Number.isFinite(parsedEventId) ? parsedEventId : null;
  const {
    data: eventResponses = [],
    isLoading: isResponsesLoading,
  } = useGetEventResponses(eventId);

  const totalMembers = eventResponses.length;
  const confirmedCount = eventResponses.filter((item) => !!item.event_guest).length;
  const isFamily = totalMembers > 1;

  const hasRsvped = useMemo(() => {
    if (!user?.id) return false;
    return eventResponses.some(
      (item) => item.user_detail.id === user.id && item.event_guest !== null
    );
  }, [eventResponses, user?.id]);

  const familyMembers = useMemo(
    () =>
      eventResponses.map((item, index) => ({
        id: `${item.user_detail.id}-${index}`,
        name: item.user_detail.username,
        avatarUrl: item.user_detail.photo ?? undefined,
      })),
    [eventResponses]
  );

  const title = params.title ?? "Event Details";
  const dateRange = params.dateRange ?? "Oct 24 - Oct 27, 2026";
  const venue = params.venue ?? "Grand Palace";
  const location = params.location ?? "Kahtmandu";
  const imageUrl = params.imageUrl;
  const familyName =
    params.familyName ??
    (familyMembers.length > 0 ? `${familyMembers[0].name} Family` : "Family RSVP");

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="items-center  pb-2 px-5">
          <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-pink-50" />
            )}
          </View>

          <Text variant="h1" className="text-center mt-4 text-lg">
            {title}
          </Text>

          <View className="flex-row items-center gap-1.5 mt-2">
            <Ionicons name="calendar-outline" size={14} color="#ee2b8c" />
            <Text variant="caption" className="text-primary">
              {dateRange}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5 mt-1">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text variant="caption">
              {venue}
              {location ? `, ${location}` : ""}
            </Text>
          </View>
        </View>

        <Section
          title="Event Highlights"
          action="View Full Itinerary"
          onAction={() => {}}
        >
          <EventHighlightTimeline highlights={DEFAULT_HIGHLIGHTS} />
        </Section>

        <Section title="Services Offered">
          <ServiceGrid services={DEFAULT_SERVICES} />
        </Section>

        <View className="px-5 py-5">
          {isResponsesLoading && (
            <View className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-4">
              <Text className="text-sm text-slate-500">Loading RSVP responses...</Text>
            </View>
          )}

          {isFamily ? (
            <FamilyRsvpCard
              familyName={familyName}
              members={familyMembers}
              confirmedCount={confirmedCount}
              onManage={() =>
                router.push(
                  `/(protected)/(client-stack)/events/${params.eventId}/(guest)/family-rsvp`
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
                onPress={() =>
                  router.push(
                    `/(protected)/(client-stack)/events/${params.eventId}/(guest)/rsvp`
                  )
                }
              >
                <Text className="text-white font-bold text-base">
                  {hasRsvped ? "Manage Your RSVP" : "Complete Your RSVP"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
