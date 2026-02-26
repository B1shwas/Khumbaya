import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { Guest } from "../../features/guests/hooks/useGuests";

interface GuestCardProps {
  guest: Guest;
  onPress?: () => void;
  onSendInvite?: () => void;
  onSendFamilyInvite?: (familyMemberIds: string[]) => void;
  onDelete?: () => void;
}

export default function GuestCard({
  guest,
  onPress,
  onSendInvite,
  onSendFamilyInvite,
  onDelete,
}: GuestCardProps) {
  const getStatusColor = () => {
    switch (guest.status) {
      case "Going":
        return "#10B981";
      case "Pending":
        return "#F59E0B";
      case "Not Going":
        return "#EF4444";
      case "Not Invited":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusBgColor = () => {
    switch (guest.status) {
      case "Going":
        return "rgba(16, 185, 129, 0.1)";
      case "Pending":
        return "rgba(245, 158, 11, 0.1)";
      case "Not Going":
        return "rgba(239, 68, 68, 0.1)";
      case "Not Invited":
        return "rgba(107, 114, 128, 0.1)";
      default:
        return "rgba(107, 114, 128, 0.1)";
    }
  };

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
        {guest.avatar ? (
          <Image
            source={{ uri: guest.avatar }}
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
              {guest.initials}
            </Text>
          </View>
        )}

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
            {guest.name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 2,
            }}
          >
            {guest.relation && (
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {guest.relation}
              </Text>
            )}
            {guest.category && (
              <>
                <Text style={{ fontSize: 12, color: "#D1D5DB" }}>•</Text>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>
                  {guest.category}
                </Text>
              </>
            )}
          </View>

          {guest.phone && (
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              {guest.phone}
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
            {guest.status}
          </Text>
        </View>
      </View>

      {/* Dietary & Plus One */}
      {(guest.dietaryRestrictions?.length || guest.hasPlusOne) && (
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
          }}
        >
          {guest.hasPlusOne && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="people" size={14} color="#6B7280" />
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                +1{guest.plusOneName ? `: ${guest.plusOneName}` : ""}
              </Text>
            </View>
          )}
          {guest.dietaryRestrictions?.map((diet, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: "#F3F4F6",
              }}
            >
              <Ionicons name="restaurant" size={12} color="#6B7280" />
              <Text style={{ fontSize: 10, color: "#6B7280" }}>{diet}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Family Members */}
      {guest.familyMembers && guest.familyMembers.length > 0 && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginBottom: 8,
            }}
          >
            <Ionicons name="people" size={14} color="#6B7280" />
            <Text style={{ fontSize: 12, color: "#6B7280", fontWeight: "500" }}>
              Family Members ({guest.familyMembers.length})
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {guest.familyMembers.slice(0, 3).map((member) => (
              <View
                key={member.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor:
                    member.rsvpStatus === "Going"
                      ? "rgba(16, 185, 129, 0.1)"
                      : member.rsvpStatus === "Pending"
                        ? "rgba(245, 158, 11, 0.1)"
                        : member.rsvpStatus === "Not Going"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 11, color: "#111827" }}>
                  {member.name}
                </Text>
                {member.rsvpStatus && member.rsvpStatus !== "Not Invited" && (
                  <Text
                    style={{
                      fontSize: 9,
                      color:
                        member.rsvpStatus === "Going"
                          ? "#10B981"
                          : member.rsvpStatus === "Pending"
                            ? "#F59E0B"
                            : "#EF4444",
                    }}
                  >
                    •{member.rsvpStatus}
                  </Text>
                )}
              </View>
            ))}
            {guest.familyMembers.length > 3 && (
              <Text style={{ fontSize: 11, color: "#6B7280" }}>
                +{guest.familyMembers.length - 3} more
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        {guest.status === "Not Invited" && onSendInvite && (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: "#EE2B8C",
            }}
            onPress={onSendInvite}
          >
            <Ionicons name="send" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
              Send Invite
            </Text>
          </TouchableOpacity>
        )}

        {/* Family Invite Button */}
        {guest.familyMembers &&
          guest.familyMembers.length > 0 &&
          guest.status !== "Not Invited" &&
          onSendFamilyInvite && (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: "#6366F1",
              }}
              onPress={() => {
                // Default: invite all family members who haven't been invited yet
                const uninvolvedFamily =
                  guest.familyMembers
                    ?.filter(
                      (m) => !guest.invitedFamilyMemberIds?.includes(m.id)
                    )
                    .map((m) => m.id) || [];
                if (uninvolvedFamily.length > 0) {
                  onSendFamilyInvite(uninvolvedFamily);
                }
              }}
            >
              <Ionicons name="people" size={16} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                Invite Family
              </Text>
            </TouchableOpacity>
          )}

        {onDelete && (
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
