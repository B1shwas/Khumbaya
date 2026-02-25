import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface GuestHeaderProps {
  totalGuests: number;
  goingCount: number;
  pendingCount: number;
  invitedCount: number;
  onAddPress?: () => void;
  onNotificationPress?: () => void;
}

export default function GuestHeader({
  totalGuests,
  goingCount,
  pendingCount,
  invitedCount,
  onAddPress,
  onNotificationPress,
}: GuestHeaderProps) {
  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
      {/* Top Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}>
              Guest Management
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280" }}>
              {totalGuests} guests total
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {onNotificationPress && (
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 12,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
              onPress={onNotificationPress}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          )}
          {onAddPress && (
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 12,
                backgroundColor: "#EE2B8C",
              }}
              onPress={onAddPress}
            >
              <Ionicons name="person-add" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Cards */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {/* Going */}
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              {goingCount}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
            Going
          </Text>
        </View>

        {/* Pending */}
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="time" size={16} color="#F59E0B" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              {pendingCount}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
            Pending
          </Text>
        </View>

        {/* Invited */}
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="mail" size={16} color="#3B82F6" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              {invitedCount}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
            Invited
          </Text>
        </View>

        {/* Total */}
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "rgba(238, 43, 140, 0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="people" size={16} color="#EE2B8C" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              {totalGuests}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
            Total
          </Text>
        </View>
      </View>
    </View>
  );
}
