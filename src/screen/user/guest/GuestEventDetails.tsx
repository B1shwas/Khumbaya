import EventHighlightTimeline from "@/src/components/event/EventHighlightTimeline";
import FamilyRsvpCard from "@/src/components/event/FamilyRsvpCard";
import ServiceGrid from "@/src/components/event/ServiceGrid";
import { Text } from "@/src/components/ui/Text";
import {
  useEventById,
  useEventResponseWithUser,
  useSubEventsOfEvent,
} from "@/src/features/events/hooks/use-event";
import { GuestDetailInterface } from "@/src/features/guests/types";
import { useRsvpStore } from "@/src/store/useRsvpStore";
import { EventService } from "@/src/types";
import { formatDate } from "@/src/utils/helper";
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
  const { data: subEvents, isLoading: subEventsLoading } = useSubEventsOfEvent(
    Number(eventId)
  );
  const setDraft = useRsvpStore((s) => s.setDraft);
  const clearDraft = useRsvpStore((s) => s.clearDraft);

  const { data: eventDetails, isLoading } = useEventById(Number(eventId));
  const { data: eventResponse, isLoading: responseLoading } =
    useEventResponseWithUser(Number(eventId));

  const isFamily = eventResponse?.isFamily ?? false;
  const responses = (eventResponse?.responses ?? []) as Array<GuestDetailInterface>;

  /**
   * Individual invite: the single guest record for the logged-in user.
   * responses[0] is the only entry when isFamily === false.
   */
  const myGuestRecord = !isFamily ? (responses[0]?.eventGuest ?? null) : null;
  console.log("This is the data in the has rsvp in the data   ", myGuestRecord);
  const hasRsvped = isFamily ? true : myGuestRecord !== null;

  const familyMembers = responses.map((r) => ({
    id: r.user.id.toString(),
    name: r.user.username,
    avatarUrl: r.user.photo ?? undefined,
  }));

  const confirmedCount = responses.filter(
    (r) => r.eventGuest?.status === "accepted"
  ).length;

  const familyName = responses[0]?.user?.relation ?? "Your Family";

  const familyDraftMembers = responses.map((r) => ({
    user: {
      id: r.user.id,
      username: r.user.username,
      photo: r.user.photo,
      email: r.user.email,
      phone: r.user.phone,
      relation: r.user.relation,
      familyId: r.user.familyId,
    },
    familyId: r.eventGuest?.familyId ?? null,
    eventGuest: r.eventGuest ?? null,
  }));

  if (isLoading || subEventsLoading || responseLoading) {
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
    clearDraft();
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
              {formatDate(eventDetails?.startDateTime)}
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
          onAction={() => {}}
        >
          <EventHighlightTimeline highlights={subEvents} />
        </Section>

        {/* ── Services ── */}
        <Section title="Services Offered">
          <ServiceGrid services={DEFAULT_SERVICES} />
        </Section>

        {/* ── RSVP section ── */}
        <View className="px-5 py-5">
          {isFamily ? (
            <View className="gap-4">
              <FamilyRsvpCard
                familyName={familyName}
                members={familyMembers}
                confirmedCount={confirmedCount}
                onEdit={() => {
                  const first = responses[0];
                  if (first) {
                    setDraft({
                      user: {
                        id: first.user.id,
                        username: first.user.username,
                        photo: first.user.photo,
                        email: first.user.email,
                        phone: first.user.phone,
                        relation: first.user.relation,
                        familyId: first.user.familyId,
                      },
                      familyId: first.eventGuest?.familyId ?? undefined,
                      eventGuest: first.eventGuest ?? null,
                      familyMembers: familyDraftMembers,
                    });
                  }

                  router.push(
                    `/(protected)/(client-stack)/events/${eventId}/(guest)/family-rsvp`
                  );
                }}
                onView={() => {
                  const first = responses[0];
                  if (first) {
                    setDraft({
                      user: {
                        id: first.user.id,
                        username: first.user.username,
                        photo: first.user.photo,
                        email: first.user.email,
                        phone: first.user.phone,
                        relation: first.user.relation,
                        familyId: first.user.familyId,
                      },
                      familyId: first.eventGuest?.familyId ?? undefined,
                      eventGuest: first.eventGuest ?? null,
                      familyMembers: familyDraftMembers,
                    });
                  }

                  router.push(
                    `/(protected)/(client-stack)/events/${eventId}/(guest)/family-responce`
                  );
                }}
              />
            </View>
          ) : (
            <View className="bg-white rounded-md p-6 border border-slate-100 shadow-sm gap-4">
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    hasRsvped ? "bg-green-100" : "bg-pink-100"
                  }`}
                >
                  <Ionicons
                    name={hasRsvped ? "checkmark-circle" : "mail"}
                    size={22}
                    color={hasRsvped ? "#16a34a" : "#ee2b8c"}
                  />
                </View>
                <View>
                  <Text className="text-lg font-extrabold text-slate-900 leading-tight">
                    {hasRsvped ? "Your RSVP" : "Invitation"}
                  </Text>
                  <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {hasRsvped ? "Confirmed" : "Action Required"}
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-slate-500 leading-relaxed">
                {hasRsvped
                  ? "Your response has been recorded. You can update your travel and accommodation details at any time."
                  : "We'd be honored to have you join us for this special occasion. Please confirm your attendance."}
              </Text>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 py-3.5 rounded-md items-center justify-center bg-primary shadow-lg shadow-primary/20 active:scale-[0.98]"
                  activeOpacity={0.8}
                  onPress={handleIndividualRsvp}
                >
                  <Text className="text-white font-bold text-sm">
                    {hasRsvped ? "Edit RSVP" : "Confirm Attendance"}
                  </Text>
                </TouchableOpacity>

                {(responses[0]?.eventGuest?.assignedRoom ||
                  responses[0]?.eventGuest?.isArrivalPickupRequired ||
                  responses[0]?.eventGuest?.isDeparturePickupRequired ||
                  responses[0]?.eventGuest?.notes ||
                  responses[0]?.eventGuest?.arrivalInfo ||
                  responses[0]?.eventGuest?.departureInfo) && (
                  <TouchableOpacity
                    className="flex-1 py-3.5 rounded-md items-center justify-center bg-slate-50 border border-slate-200 active:bg-slate-100 active:scale-[0.98]"
                    activeOpacity={0.8}
                    onPress={handleIndividualRsvp}
                  >
                    <Text className="text-slate-600 font-bold text-sm">
                      View Data
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
