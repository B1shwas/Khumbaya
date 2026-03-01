import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Room, getRoomTypeIcon, isRoomFull } from "../../types/accommodation";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onSelect: (roomId: string) => void;
  onAssignGuest?: (roomId: string) => void;
  onAssignMember?: (roomId: string) => void;
  onRemoveGuest?: (roomId: string, guestId: string) => void;
  onRemoveMember?: (roomId: string, memberId: string) => void;
  getGuestName?: (guestId: string) => string;
  getMemberName?: (memberId: string) => string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isSelected,
  onSelect,
  onAssignGuest,
  onAssignMember,
  onRemoveGuest,
  onRemoveMember,
  getGuestName,
  getMemberName,
}) => {
  const occupancyPercent =
    ((room.capacity - room.available) / room.capacity) * 100;
  const isFull = isRoomFull(room);
  const assignedGuests = room.assignedGuests || [];

  const getOccupancyColor = () => {
    if (isFull) return "#EF4444";
    if (occupancyPercent >= 70) return "#F59E0B";
    return "#10B981";
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isFull && styles.cardFull,
      ]}
      onPress={() => onSelect(room.id)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={getRoomTypeIcon(room.type) as any}
          size={32}
          color={isFull ? "#9CA3AF" : "#ee2b8c"}
        />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, isFull && styles.textMuted]}>
          {room.name}
        </Text>
        <Text style={[styles.type, isFull && styles.textMuted]}>
          {room.type.charAt(0).toUpperCase() + room.type.slice(1)} • Up to{" "}
          {room.capacity} guests
        </Text>

        <View style={styles.amenitiesContainer}>
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityBadge}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {room.amenities.length > 3 && (
            <Text style={styles.moreAmenities}>
              +{room.amenities.length - 3}
            </Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.occupancyContainer}>
            <View style={styles.occupancyBar}>
              <View
                style={[
                  styles.occupancyFill,
                  {
                    width: `${occupancyPercent}%`,
                    backgroundColor: getOccupancyColor(),
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.occupancyText, { color: getOccupancyColor() }]}
            >
              {room.available} / {room.capacity}
            </Text>
          </View>

          <Text style={styles.price}>
            ${room.pricePerNight}
            <Text style={styles.priceUnit}>/night</Text>
          </Text>
        </View>

        {/* Assigned Guests/Family Section */}
        {assignedGuests.length > 0 && (
          <View style={styles.assignedGuestsContainer}>
            <Text style={styles.assignedGuestsTitle}>
              {onAssignMember ? "Assigned Members:" : "Assigned Guests:"}
            </Text>
            <View style={styles.guestChips}>
              {assignedGuests.map((guestId) => (
                <View key={guestId} style={styles.guestChip}>
                  <Text style={styles.guestChipText}>
                    {getMemberName
                      ? getMemberName(guestId)
                      : getGuestName
                        ? getGuestName(guestId)
                        : `Guest ${guestId}`}
                  </Text>
                  {(onRemoveMember || onRemoveGuest) && (
                    <TouchableOpacity
                      onPress={() => {
                        if (onRemoveMember) {
                          onRemoveMember(room.id, guestId);
                        } else if (onRemoveGuest) {
                          onRemoveGuest(room.id, guestId);
                        }
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close-circle" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Add Guest/Member Button */}
        {(onAssignGuest || onAssignMember) && !isFull && (
          <TouchableOpacity
            style={styles.addGuestButton}
            onPress={() => {
              if (onAssignMember) {
                onAssignMember(room.id);
              } else if (onAssignGuest) {
                onAssignGuest(room.id);
              }
            }}
          >
            <Ionicons name="person-add" size={16} color="#ee2b8c" />
            <Text style={styles.addGuestText}>
              {onAssignMember ? "Assign Member" : "Assign Guest"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statusContainer}>
        {isFull ? (
          <View style={styles.statusFull}>
            <Text style={styles.statusText}>FULL</Text>
          </View>
        ) : (
          <Ionicons
            name={isSelected ? "checkmark-circle" : "add-circle-outline"}
            size={24}
            color={isSelected ? "#10B981" : "#9CA3AF"}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSelected: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  cardFull: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  textMuted: {
    color: "#9CA3AF",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  amenityBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  amenityText: {
    fontSize: 10,
    color: "#6b7280",
  },
  moreAmenities: {
    fontSize: 10,
    color: "#9CA3AF",
    alignSelf: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  occupancyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  occupancyBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    overflow: "hidden",
  },
  occupancyFill: {
    height: "100%",
    borderRadius: 3,
  },
  occupancyText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 45,
    textAlign: "right",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ee2b8c",
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "400",
    color: "#9CA3AF",
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusFull: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#EF4444",
  },
  // Guest assignment styles
  assignedGuestsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  assignedGuestsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  guestChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  guestChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestChipText: {
    fontSize: 12,
    color: "#831843",
  },
  addGuestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ee2b8c",
    borderStyle: "dashed",
  },
  addGuestText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ee2b8c",
  },
});
