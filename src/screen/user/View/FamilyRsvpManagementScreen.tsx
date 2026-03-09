import Card from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { useEventResponseWithUser } from "@/src/features/events/hooks/use-event";
import { useRsvpStore } from "@/src/store/useRsvpStore";
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

type RSVPStatus = "attending" | "declined" | "pending";

interface EventGuest {
  id: number;
  userId: number;
  eventId: number;
  familyId: number;
  status: string | null;
  arrival_date_time: string | null;
  departure_date_time: string | null;
  isAccomodation: boolean | null;
  notes: string | null;
  role: string | null;
  invited_by: number;
  joined_at: string;
}

interface UserDetail {
  id: number;
  username: string;
  email: string;
  phone: string;
  photo: string | null;
  familyId: number;
  relation: string | null;
}

interface FamilyMemberResponse {
  event_guest: EventGuest | null;
  user_detail: UserDetail;
}

interface MemberRsvp {
  id: string;
  familyId: number;
  name: string;
  avatarUrl?: string;
  status: RSVPStatus;
  dateRange?: string;
  roomNeeded?: string;
  notes?: string;
  rawStatus: string | null;
  rawArrival: string | null;
  rawDeparture: string | null;
  rawAccommodation: boolean | null;
}

function deriveStatus(event_guest: EventGuest | null): RSVPStatus {
  if (!event_guest) return "pending";
  if (event_guest.status === "rejected") return "declined";
  if (event_guest.status === "accepted") return "attending";
  return "pending";
}

function formatDateRange(
  arrival: string | null,
  departure: string | null
): string | undefined {
  if (!arrival && !departure) return undefined;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (arrival && departure) return `${fmt(arrival)} – ${fmt(departure)}`;
  if (arrival) return `From ${fmt(arrival)}`;
  return `Until ${fmt(departure!)}`;
}

function mapToMemberRsvp(item: FamilyMemberResponse): MemberRsvp {
  const status = deriveStatus(item.event_guest);
  return {
    id: item.user_detail.id.toString(),
    familyId: item.user_detail.familyId,
    name: item.user_detail.username,
    avatarUrl: item.user_detail.photo ?? undefined,
    status,
    dateRange: item.event_guest
      ? formatDateRange(
          item.event_guest.arrival_date_time,
          item.event_guest.departure_date_time
        )
      : undefined,
    roomNeeded:
      item.event_guest?.isAccomodation != null
        ? item.event_guest.isAccomodation
          ? "Yes"
          : "No"
        : undefined,
    notes: item.event_guest?.notes ?? undefined,
    rawStatus: item.event_guest?.status ?? null,
    rawArrival: item.event_guest?.arrival_date_time ?? null,
    rawDeparture: item.event_guest?.departure_date_time ?? null,
    rawAccommodation: item.event_guest?.isAccomodation ?? null,
  };
}

const statusConfig: Record<
  RSVPStatus,
  { label: string; wrapperClass: string; textClass: string }
> = {
  attending: {
    label: "Attending",
    wrapperClass: "bg-green-100 px-2.5 py-0.5 rounded-full",
    textClass: "text-xs text-green-700",
  },
  declined: {
    label: "Declined",
    wrapperClass: "bg-red-100 px-2.5 py-0.5 rounded-full",
    textClass: "text-xs text-red-600",
  },
  pending: {
    label: "Not Responded",
    wrapperClass: "bg-slate-100 px-2.5 py-0.5 rounded-full",
    textClass: "text-xs text-slate-500",
  },
};

const MemberCard = ({
  member,
  onPressRsvp,
}: {
  member: MemberRsvp;
  onPressRsvp: () => void;
}) => {
  const { label, wrapperClass, textClass } = statusConfig[member.status];
  const isAttending = member.status === "attending";
  const isPending = member.status === "pending";

  return (
    <Card className="p-4 bg-background-secondary">
      <View className="flex-row gap-4 items-start">
        {/* Avatar */}
        <View className="w-16 h-16 rounded-xl overflow-hidden bg-pink-50 shrink-0 items-center justify-center">
          {member.avatarUrl ? (
            <Image
              source={{ uri: member.avatarUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={28} color="#ee2b8c" />
          )}
        </View>

        {/* Info */}
        <View className="flex-1 min-w-0">
          <View className="flex-row justify-between items-start">
            <Text
              className="text-lg text-slate-900 flex-1 mr-2"
              variant="h2"
              numberOfLines={1}
            >
              {member.name}
            </Text>
            <View className={wrapperClass}>
              <Text variant="h2" className={textClass}>
                {label}
              </Text>
            </View>
          </View>

          {isAttending && (
            <View className="mt-2 gap-1">
              {member.dateRange && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={13} color="#64748b" />
                  <Text className="text-sm text-slate-500">
                    {member.dateRange}
                  </Text>
                </View>
              )}
              {member.roomNeeded && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="bed-outline" size={13} color="#64748b" />
                  <Text className="text-sm text-slate-500">
                    Room Needed:{" "}
                    <Text variant="h2" className="text-slate-800">
                      {member.roomNeeded}
                    </Text>
                  </Text>
                </View>
              )}
              {member.notes && (
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="chatbubble-outline"
                    size={13}
                    color="#64748b"
                  />
                  <Text className="text-sm text-slate-500" numberOfLines={2}>
                    {member.notes}
                  </Text>
                </View>
              )}
            </View>
          )}

          {isPending && (
            <Text className="mt-2 text-sm text-slate-400 italic">
              Please complete details for {member.name.split(" ")[0]}
            </Text>
          )}
        </View>
      </View>

      {/* CTA */}
      <View className="mt-4 pt-4 border-t border-slate-100">
        <TouchableOpacity
          className="w-full py-2.5 rounded-md items-center justify-center"
          style={{ backgroundColor: "#ee2b8c" }}
          activeOpacity={0.85}
          onPress={onPressRsvp}
        >
          <Text variant="h2" className="text-white text-sm">
            {isPending ? "Complete RSVP" : "Edit RSVP"}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default function FamilyRsvpManagementScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const setDraft = useRsvpStore((s) => s.setDraft);

  const { data: eventResponses, isLoading } = useEventResponseWithUser(
    Number(eventId)
  );

  const members: MemberRsvp[] = (eventResponses?.responses ?? []).map(
    (item: FamilyMemberResponse) => mapToMemberRsvp(item)
  );

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-light items-center justify-center"
        edges={["bottom"]}
      >
        <ActivityIndicator size="large" color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  // this will set the member previous rsvp if any
  const handleMemberRsvp = (member: MemberRsvp) => {
    setDraft({
      userId: member.id,
      familyId: member.familyId,
      memberName: member.name,
      rawStatus: member.rawStatus,
      rawArrival: member.rawArrival,
      rawDeparture: member.rawDeparture,
      rawAccommodation: member.rawAccommodation,
      rawNotes: member.notes ?? null,
    });
    router.push(`/(protected)/(client-stack)/events/${eventId}/(guest)/rsvp`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-tertairy" edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}
      >
        <Text
          variant="h2"
          className="text-xs uppercase tracking-widest text-slate-400 px-1 mb-1"
        >
          Family Members
        </Text>
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onPressRsvp={() => handleMemberRsvp(member)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
