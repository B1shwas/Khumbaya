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
  const getStatusColor = () => {
    switch (guest.status?.toLowerCase()) {
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
    switch (guest.status?.toLowerCase()) {
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

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {/* Avatar */}
        {guest.user.photo ? (
          <Image
            source={{ uri: guest.user.photo }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#EE2B8C",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              {initials}
            </Text>
          </View>
        )}

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
            {guest.user.username}
          </Text>

          {guest.user.relation && guest.user.relation.trim() !== "" && (
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              {guest.user.relation.trim()}
            </Text>
          )}

          {guest.user.phone && (
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              {guest.user.phone}
            </Text>
          )}
        </View>

        {/* Status Badge */}
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: getStatusBgColor(),
          }}
        >
          <Text
            style={{ fontSize: 12, fontWeight: "600", color: getStatusColor() }}
          >
            {guest.status || "Pending"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
