import MemberCard from "@/src/components/guest/family/MemberCard";
import { Text } from "@/src/components/ui/Text";
import { useEventResponseWithUser } from "@/src/features/events/hooks/use-event";
import { GuestDetailInterface } from "@/src/features/guests/types";
import { useRsvpStore } from "@/src/store/useRsvpStore";
import { MemberRsvpCardProp, mapToMemberRsvp } from "@/src/utils/type/rsvp";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FamilyRsvpManagementScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const setDraft = useRsvpStore((s) => s.setDraft);
  const { data: eventResponses, isLoading } = useEventResponseWithUser(
    Number(eventId)
  );

  const members: MemberRsvpCardProp[] = (eventResponses?.responses ?? []).map(
    (item: GuestDetailInterface) => mapToMemberRsvp(item)
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
  const handleMemberRsvp = (member: MemberRsvpCardProp) => {
    setDraft({
      userId: member.id,
      familyId: member.familyId,
      memberName: member.name,
      rawStatus: member.rawStatus,
      rawArrival: member.rawArrival,
      rawDeparture: member.rawDeparture,
      rawAccommodation: member.rawAccommodation,
      rawIsArrivalPickupRequired: member.rawIsArrivalPickupRequired,
      rawIsDeparturePickupRequired: member.rawIsDeparturePickupRequired,
      rawNotes: member.notes ?? null,
      rawAssignedRoom: member.rawAssignedRoom,
      rawArrivalInfo: member.rawArrivalInfo,
      rawDepartureInfo: member.rawDepartureInfo,
    });
    router.push(`/(protected)/(client-stack)/events/${eventId}/(guest)/rsvp`);
  };

  const handleMemberDetails = (member: MemberRsvpCardProp) => {
    setDraft({
      userId: member.id,
      familyId: member.familyId,
      memberName: member.name,
      rawStatus: member.rawStatus,
      rawArrival: member.rawArrival,
      rawDeparture: member.rawDeparture,
      rawAccommodation: member.rawAccommodation,
      rawIsArrivalPickupRequired: member.rawIsArrivalPickupRequired,
      rawIsDeparturePickupRequired: member.rawIsDeparturePickupRequired,
      rawNotes: member.notes ?? null,
      rawAssignedRoom: member.rawAssignedRoom,
      rawArrivalInfo: member.rawArrivalInfo,
      rawDepartureInfo: member.rawDepartureInfo,
    });
    router.push(`/(protected)/(client-stack)/events/${eventId}/(guest)/guest-details`);
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
            onPressDetails={() => handleMemberDetails(member)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
