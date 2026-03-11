import Card from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { MemberRsvpCardProp, RSVPStatus } from "@/src/utils/type/rsvp";
import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    TouchableOpacity,
    View,
} from "react-native";
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
  isOrganizerView = false,
}: {
  member: MemberRsvpCardProp;
  onPressRsvp: () => void;
  isOrganizerView?: boolean;
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
            {isOrganizerView
              ? "View RSVP Details"
              : isPending
                ? "Complete RSVP"
                : "Edit RSVP"}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};
export default MemberCard;