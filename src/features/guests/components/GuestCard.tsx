import { Image, Text, TouchableOpacity, View } from "react-native";
interface GuestCardProps {
  guest: {
    user: {
      id: number;
      username: string;
      email: string;
      photo?: string | null;
      phone?: string | null;
      relation?: string | null;
    };
    status: string;
    rsvp_status: string;
  };
  onPress?: () => void;
}

export default function GuestCard({ guest, onPress }: GuestCardProps) {
  const displayStatus = (guest.status || guest.rsvp_status || "Pending").trim();

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

  const initials = guest.user.username
    ? guest.user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "GU";

  const displayName = guest.user.username?.trim() || guest.user.email || "Guest";
  const relation = guest.user.relation?.trim();
  const phone = guest.user.phone?.trim();

  return (
    <View className="mb-3 rounded-2xl bg-white">
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
        className="rounded-2xl"
      >
        <View className="min-h-[86px] flex-row items-center gap-3 px-4 py-3">
          {guest.user.photo ? (
            <Image
              source={{ uri: guest.user.photo }}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EE2B8C]">
              <Text className="text-base font-semibold text-white">{initials}</Text>
            </View>
          )}

          <View className="flex-1">
            <Text numberOfLines={1} className="text-base font-semibold text-gray-900">
              {displayName}
            </Text>

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
        </View>
      </TouchableOpacity>
    </View>
  );
}
