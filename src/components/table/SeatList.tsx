import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Guest, Seat } from "../../utils/tableHelpers";

interface SeatListProps {
  seats: Seat[];
  guestMap: Map<string, Guest>;
  onSeatPress?: (seatId: string, guest: Guest | null) => void;
}

export const SeatList: React.FC<SeatListProps> = ({
  seats,
  guestMap,
  onSeatPress,
}) => {
  return (
    <View style={styles.seatsGrid}>
      {seats.map((seat, index) => {
        const guest = guestMap.get(seat.guestId || "") || null;
        const isFirstSeatOfGroup =
          guest && seats.findIndex((s) => s.guestId === guest.id) === index;

        return (
          <TouchableOpacity
            key={seat.id}
            style={[
              styles.seatSlot,
              guest && styles.seatSlotFilled,
              guest && isFirstSeatOfGroup && styles.seatSlotGroup,
            ]}
            onPress={() => onSeatPress?.(seat.id, guest)}
            disabled={!onSeatPress}
          >
            <View
              style={[
                styles.seatNumber,
                guest && styles.seatNumberFilled,
                isFirstSeatOfGroup && styles.seatNumberGroup,
              ]}
            >
              <Text
                style={[
                  styles.seatNumberText,
                  guest && styles.seatNumberTextFilled,
                ]}
              >
                {guest ? guest.name.charAt(0) : index + 1}
              </Text>
            </View>
            {guest && (
              <Text style={styles.guestName} numberOfLines={1}>
                {guest.name.split(" ")[0]}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  seatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  seatSlot: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  seatSlotFilled: {
    borderStyle: "solid",
    borderColor: "#EE2B8C",
    backgroundColor: "#FDF2F8",
  },
  seatSlotGroup: {
    borderColor: "#8B5CF6",
    backgroundColor: "#F5F3FF",
  },
  seatNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  seatNumberFilled: {
    backgroundColor: "#EE2B8C",
  },
  seatNumberGroup: {
    backgroundColor: "#8B5CF6",
  },
  seatNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  seatNumberTextFilled: {
    color: "#FFFFFF",
  },
  guestName: {
    fontSize: 9,
    color: "#374151",
    marginTop: 2,
    maxWidth: 52,
    textAlign: "center",
  },
});
