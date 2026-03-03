import EventHighlightTimeline from "@/src/components/event/EventHighlightTimeline";
import FamilyRsvpCard from "@/src/components/event/FamilyRsvpCard";
import ServiceGrid from "@/src/components/event/ServiceGrid";
import { useGetInvitationsForEvent } from "@/src/features/guests/api/use-guests";
import { EventHighlight, EventService, FamilyMember } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Static catalogue data ─────────────────────────────────────────────────
// Replace with API data once a guest-event-details endpoint is available.

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

// ─── Section wrapper ───────────────────────────────────────────────────────

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
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-[18px] font-bold text-gray-900">{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text className="text-sm font-semibold text-primary">{action}</Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

// ─── Screen ────────────────────────────────────────────────────────────────

export default function GuestEventDetails() {
  const params = useLocalSearchParams<{
    eventId: string;
    title?: string;
    dateRange?: string;
    venue?: string;
    location?: string;
    imageUrl?: string;
    familyName?: string;
  }>();

  const eventId = useMemo(() => {
    const parsed = Number(params.eventId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const { data: invitations, isLoading: rsvpLoading } =
    useGetInvitationsForEvent(eventId);

  // Derive family RSVP summary from invitations.
  // Swap this block for a dedicated family-rsvp API call when available.
  const { familyMembers, confirmedCount } = useMemo(() => {
    if (!invitations)
      return { familyMembers: [] as FamilyMember[], confirmedCount: 0 };
    const members: FamilyMember[] = invitations.map((inv: any) => ({
      id: String(inv.user?.id ?? inv.id ?? Math.random()),
      name: inv.user?.name ?? inv.fullName ?? "Guest",
      avatarUrl: inv.user?.avatarUrl ?? undefined,
    }));
    const confirmed = invitations.filter(
      (inv: any) => inv.status === "CONFIRMED" || inv.rsvpStatus === "confirmed"
    ).length;
    return { familyMembers: members, confirmedCount: confirmed };
  }, [invitations]);

  // ── Hero values from route params (passed by the calling screen) ──
  const title = params.title ?? "Event Details";
  const dateRange = params.dateRange ?? "—";
  const venue = params.venue ?? "—";
  const location = params.location ?? "";
  const imageUrl = params.imageUrl;
  const familyName = params.familyName ?? "Family";

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#1e293b" />
        </Pressable>

        <Text className="flex-1 text-center text-base font-bold text-gray-900">
          Khumbaya Guest Portal
        </Text>

        <Pressable
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={22} color="#1e293b" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Hero ── */}
        <View className="items-center pt-6 pb-2 px-5">
          <View style={styles.heroImageRing}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.heroImage, styles.heroImageFallback]} />
            )}
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mt-4">
            {title}
          </Text>

          <View className="flex-row items-center gap-1.5 mt-2">
            <Ionicons name="calendar-outline" size={14} color="#ee2b8c" />
            <Text className="text-sm font-medium text-primary">
              {dateRange}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5 mt-1">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text className="text-sm text-gray-500">
              {venue}
              {location ? `, ${location}` : ""}
            </Text>
          </View>
        </View>

        {/* ── Divider ── */}
        <View className="h-[1px] bg-gray-100 mx-5 mt-4" />

        {/* ── Event Highlights ── */}
        <Section
          title="Event Highlights"
          action="View Full Itinerary"
          onAction={() => {
            // TODO: navigate to full itinerary screen
          }}
        >
          <EventHighlightTimeline highlights={DEFAULT_HIGHLIGHTS} />
        </Section>

        <View className="h-[1px] bg-gray-100 mx-5" />

        {/* ── Services Offered ── */}
        <Section title="Services Offered">
          <ServiceGrid services={DEFAULT_SERVICES} />
        </Section>

        <View className="h-[1px] bg-gray-100 mx-5" />

        {/* ── Family RSVP ── */}
        <View className="px-5 py-5">
          <Text className="text-[18px] font-bold text-gray-900 mb-4">
            Family RSVP
          </Text>
          {rsvpLoading ? (
            <ActivityIndicator color="#ee2b8c" />
          ) : (
            <FamilyRsvpCard
              familyName={familyName}
              members={familyMembers}
              confirmedCount={confirmedCount}
              onManage={() => {
                // TODO: navigate to family RSVP management
              }}
            />
          )}
        </View>

        <View className="h-[1px] bg-gray-100 mx-5" />

        {/* ── Venue map link ── */}
        <View className="px-5 py-5">
          <TouchableOpacity
            className="flex-row items-center gap-3 p-4 rounded-xl border border-gray-100"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open venue in maps"
          >
            <View className="w-12 h-12 rounded-lg bg-gray-100 items-center justify-center">
              <Ionicons name="map-outline" size={22} color="#ee2b8c" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-900">
                Need help finding us?
              </Text>
              <Text className="text-[12px] text-gray-500 mt-0.5">
                Open venue location in maps
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  heroImageRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "rgba(238, 43, 140, 0.12)",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroImageFallback: {
    backgroundColor: "#f3e6ee",
  },
});
