import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GuestDetailInterface } from "../../features/guests/types";

interface GuestCardProps {
  guest: GuestDetailInterface;
  onPress?: () => void;
  onDelete?: () => void;
  onDraftPress?: () => void;
  isDraftActionLoading?: boolean;
}

export default function GuestCard({
  guest,
  onPress,
  onDelete,
  onDraftPress,
  isDraftActionLoading = false,
}: GuestCardProps) {
  const displayStatus = (guest?.event_guest?.status || "Pending").trim();
  const isDraft = displayStatus.toLowerCase() === "draft";

  const getStatusColor = () => {
    switch (displayStatus.toLowerCase()) {
      case "accepted":
      case "going":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "declined":
      case "not going":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusBgColor = () => {
    switch (displayStatus.toLowerCase()) {
      case "accepted":
      case "going":
        return "rgba(16, 185, 129, 0.1)";
      case "pending":
        return "rgba(245, 158, 11, 0.1)";
      case "declined":
      case "not going":
        return "rgba(239, 68, 68, 0.1)";
      default:
        return "rgba(107, 114, 128, 0.1)";
    }
  };

  const initials = guest.user_detail.username
    ? guest.user_detail.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GU";

  const displayName =
    guest.user_detail.username?.trim() || guest.user_detail.email || "Guest";
  const relation = guest.user_detail.relation?.trim();
  const phone = guest.user_detail.phone?.trim();

  const getCheckInStatus = () => {
    const arrival = guest.event_guest.arrival_date_time;
    const departure = guest.event_guest.departure_date_time;

    if (departure) return "Checked out";
    if (arrival) return "Checked in";
    return "Not checked in";
  };

  const getCheckInStyles = () => {
    const status = getCheckInStatus();
    if (status === "Checked out") {
      return { backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#DC2626" };
    }
    if (status === "Checked in") {
      return { backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#047857" };
    }
    return { backgroundColor: "rgba(107, 114, 128, 0.12)", color: "#4B5563" };
  };

  const checkInStatus = getCheckInStatus();
  const checkInStyles = getCheckInStyles();

  return (
    <View className="mb-3 rounded-2xl bg-white">
      <Pressable onPress={onPress} disabled={!onPress} className="rounded-2xl">
        <View className="min-h-[86px] flex-row items-center gap-3 px-4 py-3">
          {guest.user_detail.photo ? (
            <Image
              source={{ uri: guest.user_detail.photo }}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EE2B8C]">
              <Text className="text-base font-semibold text-white">
                {initials}
              </Text>
            </View>
          )}

          <View className="flex-1">
            <View className="flex-row items-center justify-between gap-3">
              <Text
                numberOfLines={1}
                className="text-base font-semibold text-gray-900"
              >
                {displayName}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: checkInStyles.backgroundColor }}
              >
                <Text
                  numberOfLines={1}
                  className="text-[11px] font-semibold"
                  style={{ color: checkInStyles.color }}
                >
                  {checkInStatus}
                </Text>
              </TouchableOpacity>
            </View>

            {relation ? (
              <Text numberOfLines={1} className="mt-0.5 text-xs text-gray-500">
                {relation}
              </Text>
            ) : null}

            {phone ? (
              <Text numberOfLines={1} className="mt-0.5 text-xs text-gray-500">
                {phone}
              </Text>
            ) : null}
          </View>

          <View className="items-end justify-center gap-2">
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: getStatusBgColor(),
                maxWidth: 120,
              }}
            >
              <Text
                numberOfLines={1}
                className="text-xs font-semibold"
                style={{ color: getStatusColor() }}
              >
                {displayStatus}
              </Text>
            </View>

            {onDelete ? (
              <TouchableOpacity
                onPress={onDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Pressable>

      {isDraft && onDraftPress ? (
        <View className="px-4 pb-3">
          <Pressable
            onPress={onDraftPress}
            disabled={isDraftActionLoading}
            className="h-10 flex-row items-center justify-center rounded-xl border border-[#EE2B8C] bg-[#EE2B8C]/10"
          >
            {isDraftActionLoading ? (
              <ActivityIndicator size="small" color="#EE2B8C" />
            ) : (
              <>
                <Ionicons
                  name="paper-plane-outline"
                  size={16}
                  color="#EE2B8C"
                />
                <Text className="ml-2 text-sm font-semibold text-[#EE2B8C]">
                  Send Invitation
                </Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
