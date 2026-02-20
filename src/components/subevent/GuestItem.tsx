import { Guest } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface GuestItemProps {
  guest: Guest;
  onToggleInvite: (guestId: string) => void;
  onDelete: (guestId: string) => void;
}

export default function GuestItem({
  guest,
  onToggleInvite,
  onDelete,
}: GuestItemProps) {
  const handleDelete = () => {
    Alert.alert(
      "Delete Guest",
      `Are you sure you want to remove ${guest.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(guest.id),
        },
      ]
    );
  };

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      <View
        style={[styles.guestItem, guest.invited && styles.guestItemInvited]}
      >
        <TouchableOpacity
          style={styles.guestToggle}
          onPress={() => onToggleInvite(guest.id)}
        >
          <View
            style={[
              styles.inviteCheckbox,
              guest.invited && styles.inviteCheckboxSelected,
            ]}
          >
            {guest.invited && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
          <View style={styles.guestInfo}>
            <Text
              style={[
                styles.guestName,
                guest.invited && styles.guestNameInvited,
              ]}
            >
              {guest.name}
            </Text>
            {guest.email && (
              <Text style={styles.guestEmail} numberOfLines={1}>
                {guest.email}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.guestRelation} numberOfLines={1}>
          {guest.relation}
        </Text>

        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButtonSmall}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  guestItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  guestItemInvited: {
    backgroundColor: "#f0fdf4",
  },
  guestToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inviteCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  inviteCheckboxSelected: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  guestNameInvited: {
    color: "#10B981",
  },
  guestEmail: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  guestRelation: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginRight: 12,
    maxWidth: 80,
  },
  deleteButtonSmall: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: "100%",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
});
