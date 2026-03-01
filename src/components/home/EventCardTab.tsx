import Card from "@/src/components/ui/guest-profile/Card";
import { Event, EventRole } from "@/src/constants/event";
import { useAcceptRsvpInvitation } from "@/src/features/events/hooks/use-event";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const roleConfig: Record<
  EventRole,
  { wrapperClass: string; textClass: string }
> = {
  Organizer: {
    wrapperClass: "bg-purple-100 px-2 py-1 rounded-full",
    textClass: "text-xs font-medium text-purple-700",
  },
  Vendor: {
    wrapperClass: "bg-blue-100 px-2 py-1 rounded-full",
    textClass: "text-xs font-medium text-blue-700",
  },
  Guest: {
    wrapperClass: "bg-green-100 px-2 py-1 rounded-full",
    textClass: "text-xs font-medium text-green-700",
  },
};

const defaultRoleStyle = {
  wrapperClass: "bg-gray-100 px-2 py-1 rounded-full",
  textClass: "text-xs font-medium text-gray-700",
};

export const Event_WITH_ROLE = ({
  event,
  onPress,
  isRequest,
  asGuest,
}: {
  event: Event;
  onPress: () => void;
  isRequest?: boolean;
  asGuest?: boolean;
}) => {
  const router = useRouter();
  const { mutate: acceptRsvpInvitation, isPending: isAcceptingInvitation } =
    useAcceptRsvpInvitation();
  const roleStyle = roleConfig[event.role as EventRole] ?? defaultRoleStyle;
  const roleLabel = event.role ?? "Unknown";
  const { wrapperClass, textClass } = roleStyle;

  return (
    <Card className="my-2">
      <Pressable
        className="flex-row p-3 rounded-md overflow-hidden"
        onPress={() => {
          if (isRequest && asGuest) {
            router.push(
              `/(protected)/(client-stack)/events/${event.id}/(guest)/rsvp`
            );
          } else if (isRequest && !asGuest) {
            router.push(
              `/(protected)/(client-stack)/events/${event.id}/(vendor)/`
            );
          } else {
            router.push(`/(protected)/(client-stack)/events/${event.id}`);
          }
        }}
      >
        <View className="w-20 h-20 rounded-lg overflow-hidden">
          <Image source={{ uri: event.imageUrl }} className="w-full h-full" />
        </View>
        <View className="flex-1 ml-3 justify-between">
          <View className="flex-row justify-between items-start">
            <Text
              className="font-jakarta-bold text-base text-text-light flex-1 mr-2"
              numberOfLines={2}
            >
              {event.title}
            </Text>
            <View className={wrapperClass}>
              <Text className={textClass}>{roleLabel}</Text>
            </View>
          </View>
          <View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text
                className="font-jakarta text-[13px] text-text-tertiary ml-1"
                numberOfLines={1}
              >
                {event.location}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Ionicons name="calendar" size={14} color={"#ee2b8c"} />
              <Text className="font-jakarta-semibold text-[13px] text-primary ml-1">
                {event.date} • {event.time}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
      {isRequest && !asGuest && (
        <View className="border-t border-border mx-3 mt-1 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="bg-blue-50 p-1.5 rounded-full">
                <Ionicons name="briefcase-outline" size={14} color="#3B82F6" />
              </View>
              <Text className="font-jakarta-semibold text-xs text-blue-700">
                Vendor booking request
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-primary px-3 py-1.5 rounded-full"
                onPress={() =>
                  router.push(
                    `/(protected)/(client-stack)/events/${event.id}/(vendor)/`
                  )
                }
              >
                <Text className="font-jakarta-semibold text-xs text-white">
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-border px-3 py-1.5 rounded-full">
                <Text className="font-jakarta-semibold text-xs text-text-secondary">
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {isRequest && asGuest && (
        <View className="border-t border-border mx-3 mt-1 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="bg-pink-50 p-1.5 rounded-full">
                <Ionicons name="mail-outline" size={14} color="#ee2b8c" />
              </View>
              <Text className="font-jakarta-semibold text-xs text-primary">
                You're invited — RSVP now
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-primary px-3 py-1.5 rounded-full"
                onPress={() => {
                  if (!event.invitationId) {
                    Alert.alert(
                      "Missing invitation",
                      "Invitation ID not found for this RSVP."
                    );
                    return;
                  }

                  acceptRsvpInvitation(event.invitationId, {
                    onSuccess: () => {
                      Alert.alert("Success", "RSVP accepted successfully.");
                    },
                    onError: () => {
                      Alert.alert(
                        "Error",
                        "Failed to accept RSVP. Please try again."
                      );
                    },
                  });
                }}
                disabled={isAcceptingInvitation}
              >
                <Text className="font-jakarta-semibold text-xs text-white">
                  Going
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-border px-3 py-1.5 rounded-full">
                <Text className="font-jakarta-semibold text-xs text-text-secondary">
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Card>
  );
};
