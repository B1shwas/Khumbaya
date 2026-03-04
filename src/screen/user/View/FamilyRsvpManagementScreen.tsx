import Card from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RSVPStatus = "attending" | "declined" | "pending";

interface MemberRsvp {
  id: string;
  name: string;
  avatarUrl?: string;
  status: RSVPStatus;
  dateRange?: string;
  roomNeeded?: string;
  transport?: string;
}

// TODO: replace with real data from API / store
const MOCK_MEMBERS: MemberRsvp[] = [
  {
    id: "1",
    name: "Priya Sharma",
    status: "attending",
    dateRange: "Jul 12 - Jul 15",
    roomNeeded: "Yes",
    transport: "Arranged",
  },
  {
    id: "2",
    name: "Rahul Sharma",
    status: "attending",
    dateRange: "Jul 12 - Jul 15",
    roomNeeded: "Yes",
    transport: "Self",
  },
  {
    id: "3",
    name: "Ananya Sharma",
    status: "pending",
  },
  {
    id: "4",
    name: "Aarav Sharma",
    status: "attending",
    dateRange: "Jul 12 - Jul 15",
    roomNeeded: "Shared",
  },
];

const statusConfig: Record<
  RSVPStatus,
  { label: string; wrapperClass: string; textClass: string }
> = {
  attending: {
    label: "Attending",
    wrapperClass: "bg-green-100 px-2.5 py-0.5 rounded-full",
    textClass: "text-xs font-semibold text-green-700",
  },
  declined: {
    label: "Declined",
    wrapperClass: "bg-red-100 px-2.5 py-0.5 rounded-full",
    textClass: "text-xs font-semibold text-red-600",
  },
  pending: {
    label: "Not Responded",
    wrapperClass: "bg-slate-100 px-2.5 py-0.5 rounded-full",
    textClass: "text-xs font-semibold text-slate-500",
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
              className="text-lg font-bold text-slate-900 flex-1 mr-2"
              numberOfLines={1}
            >
              {member.name}
            </Text>
            <View className={wrapperClass}>
              <Text className={textClass}>{label}</Text>
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
                    <Text className="text-slate-800 font-semibold">
                      {member.roomNeeded}
                    </Text>
                  </Text>
                </View>
              )}
              {member.transport && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="car-outline" size={13} color="#64748b" />
                  <Text className="text-sm text-slate-500">
                    Transport:{" "}
                    <Text className="text-slate-800 font-semibold">
                      {member.transport}
                    </Text>
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
          className="w-full py-2.5 rounded-lg items-center justify-center"
          style={{ backgroundColor: "#ee2b8c" }}
          activeOpacity={0.85}
          onPress={onPressRsvp}
        >
          <Text className="text-white font-bold text-sm">
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

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}
      >
        <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-1 mb-1">
          Family Members
        </Text>
        {MOCK_MEMBERS.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onPressRsvp={() =>
              router.push(
                `/(protected)/(client-stack)/events/${eventId}/(guest)/rsvp?memberId=${member.id}`
              )
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
