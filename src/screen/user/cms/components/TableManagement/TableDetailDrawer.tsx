import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Guest, GuestGroup, Table } from "../../types/tableManagement";
import { styles } from "../styles/TableManagement.styles";

interface TableDetailDrawerProps {
  selectedTable: Table | undefined;
  guests: Guest[];
  groups: GuestGroup[];
  animationValue: Animated.Value;
  onRemoveGuest: (seatId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onSelectSeat: (seatId: string) => void;
  onEdit: () => void;
}

export const TableDetailDrawer: React.FC<TableDetailDrawerProps> = ({
  selectedTable,
  guests,
  groups,
  animationValue,
  onRemoveGuest,
  onRemoveGroup,
  onSelectSeat,
  onEdit,
}) => {
  if (!selectedTable) return null;

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateY: animationValue }] }]}
    >
      <View style={styles.drawerHandle} />
      <View style={styles.drawerContent}>
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.drawerTitle}>Table {selectedTable.name}</Text>
            <Text style={styles.drawerSubtitle}>
              {selectedTable.seats.filter((s) => !s.guestId).length} seats
              available
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="create" size={20} color="#ee2b8c" />
          </TouchableOpacity>
        </View>

        <View style={styles.seatsGrid}>
          {selectedTable.seats.map((seat, index) => {
            const guest = guests.find((g) => g.id === seat.guestId);
            const group = guest
              ? groups.find((g) => g.id === guest.groupId)
              : null;
            const isFirstSeatOfGroup =
              guest &&
              selectedTable.seats.findIndex((s) => s.guestId === guest.id) ===
                index;

            return (
              <TouchableOpacity
                key={seat.id}
                style={[
                  styles.seatSlot,
                  guest && styles.seatSlotFilled,
                  group && styles.seatSlotGroup,
                ]}
                onPress={() => {
                  if (guest) {
                    if (isFirstSeatOfGroup) {
                      onRemoveGroup(group!.id);
                    } else {
                      onRemoveGuest(seat.id);
                    }
                  } else {
                    onSelectSeat(seat.id);
                  }
                }}
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
                    {index + 1}
                  </Text>
                </View>
                {guest ? (
                  <View style={styles.seatGuestInfo}>
                    <Text style={styles.seatGuestName}>{guest.name}</Text>
                    {isFirstSeatOfGroup && (
                      <Text style={styles.seatGroupLabel}>
                        {group!.name} ({group!.totalSize})
                      </Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.seatEmptyText}>Empty</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};
