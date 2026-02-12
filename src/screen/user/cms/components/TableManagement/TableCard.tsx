import React from "react";
import { Animated, Text, View } from "react-native";
import { Guest, Table } from "../../types/tableManagement";
import { styles } from "../styles/TableManagement.styles";

interface TableCardProps {
  table: Table;
  guests: Guest[];
  isSelected: boolean;
  onSelect: (tableId: string) => void;
  panHandlers: any;
}

export const TableCard: React.FC<TableCardProps> = ({
  table,
  guests,
  isSelected,
  onSelect,
  panHandlers,
}) => {
  const occupancy = table.seats.filter((s) => s.guestId).length;
  const occupancyPercent = (occupancy / table.capacity) * 100;

  const getOccupancyColor = () => {
    if (occupancyPercent === 100) return "#10B981";
    if (occupancyPercent >= 70) return "#F59E0B";
    return "#6B7280";
  };

  const getOccupancyText = () => {
    if (occupancy === table.capacity) return "FULL";
    return `${occupancy} / ${table.capacity} SEATS`;
  };

  const getGuestById = (guestId: string) =>
    guests.find((g) => g.id === guestId);

  return (
    <Animated.View
      style={[
        styles.tableCard,
        {
          left: table.x,
          top: table.y,
        },
        table.type === "circle" && styles.tableCardCircle,
        isSelected && styles.tableCardSelected,
      ]}
      {...panHandlers}
      onPress={() => onSelect(table.id)}
    >
      {/* Seat placeholders for rectangle table with guest names */}
      {table.type === "rectangle" && (
        <View style={styles.rectangleSeats}>
          <View style={styles.rectangleSeatTop}>
            {Array.from({ length: 4 }).map((_, i) => {
              const seat = table.seats[i];
              const guest = seat?.guestId ? getGuestById(seat.guestId) : null;
              return (
                <View
                  key={`top-${i}`}
                  style={[
                    styles.rectangleSeatBox,
                    guest ? styles.seatFilled : styles.seatEmpty,
                  ]}
                >
                  {guest ? (
                    <Text style={styles.seatGuestLabel} numberOfLines={1}>
                      {guest.name.split(" ")[0]}
                    </Text>
                  ) : (
                    <Text style={styles.seatNumberLabel}>{i + 1}</Text>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.rectangleSeatBottom}>
            {Array.from({ length: 4 }).map((_, i) => {
              const seat = table.seats[i + 4];
              const guest = seat?.guestId ? getGuestById(seat.guestId) : null;
              return (
                <View
                  key={`bottom-${i}`}
                  style={[
                    styles.rectangleSeatBox,
                    guest ? styles.seatFilled : styles.seatEmpty,
                  ]}
                >
                  {guest ? (
                    <Text style={styles.seatGuestLabel} numberOfLines={1}>
                      {guest.name.split(" ")[0]}
                    </Text>
                  ) : (
                    <Text style={styles.seatNumberLabel}>{i + 5}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Circle table */}
      {table.type === "circle" && (
        <>
          <View style={styles.circleTable}>
            <Text style={styles.tableLabel}>TABLE</Text>
            <Text style={styles.tableNumber}>{table.name}</Text>
          </View>
          <View
            style={[
              styles.occupancyBadge,
              { backgroundColor: getOccupancyColor() },
            ]}
          >
            <Text style={styles.occupancyText}>{getOccupancyText()}</Text>
          </View>
          {/* Show seated guests on circle table */}
          <View style={styles.circleGuests}>
            {table.seats.slice(0, 6).map((seat) => {
              const guest = seat?.guestId ? getGuestById(seat.guestId) : null;
              if (!guest) return null;
              return (
                <View key={seat.id} style={styles.circleGuestDot}>
                  <Text style={styles.circleGuestInitial}>
                    {guest.name.charAt(0)}
                  </Text>
                </View>
              );
            })}
            {table.seats.filter((s) => s.guestId).length > 6 && (
              <Text style={styles.moreGuests}>
                +{table.seats.filter((s) => s.guestId).length - 6}
              </Text>
            )}
          </View>
        </>
      )}

      {/* Selected indicator */}
      {isSelected && <View style={styles.selectedRing} />}
    </Animated.View>
  );
};
