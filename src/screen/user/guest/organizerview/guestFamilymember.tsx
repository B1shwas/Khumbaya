import MemberCard from "@/src/components/guest/family/MemberCard";
import { Text } from "@/src/components/ui/Text";
import {
    useFamilyGuestStore,
    useGuestDetailStore,
} from "@/src/features/guests/store/useGuestDetailStore";
import { FamilyGroup } from "@/src/features/guests/types";
import { mapToMemberRsvp, MemberRsvpCardProp } from "@/src/utils/type/rsvp";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuestFamilyMember() {
    const router = useRouter();
    const { eventId, family } = useLocalSearchParams<{
        eventId: string;
        family?: string;
    }>();

    const familyGroupFromStore = useFamilyGuestStore((state) => state.familyGroup);
    const setGuestDetail = useGuestDetailStore((state) => state.setGuestDetail);

    const selectedFamilyGroup: FamilyGroup | null = useMemo(() => {
        if (familyGroupFromStore) return familyGroupFromStore;
        if (!family) return null;

        try {
            const parsed = JSON.parse(family);
            return parsed as FamilyGroup;
        } catch {
            return null;
        }
    }, [familyGroupFromStore, family]);

    const members: MemberRsvpCardProp[] = useMemo(
        () => (selectedFamilyGroup?.members ?? []).map(mapToMemberRsvp),
        [selectedFamilyGroup]
    );

    const handleOpenMember = (member: MemberRsvpCardProp) => {
        if (!selectedFamilyGroup || !eventId) return;

        const guest = selectedFamilyGroup.members.find(
            (item) => item.user_detail.id.toString() === member.id
        );

        if (!guest) return;
        setGuestDetail(guest);
        router.push({
            pathname:
                `/(protected)/(client-stack)/events/${eventId}/(organizer)/guests/${guest.user_detail.id}/guest-details` as any,
            params: { guest: JSON.stringify(guest) },
        });
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
                    {selectedFamilyGroup?.family_name ?? "Family"} Members
                </Text>

                {members.length ? (
                    members.map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member} 
                            isOrganizerView={true}
                            onPressRsvp={() => handleOpenMember(member)}
                        />
                    ))
                ) : (
                    <View className="rounded-xl bg-white p-4">
                        <Text className="text-slate-500">No family members found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}