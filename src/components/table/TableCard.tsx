import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Guest, Table, getSeatedCount } from "../../utils/tableHelpers";

interface TableCardProps {
  table: Table;
  guests: Guest[];
  isSelected: boolean;
  onSelect: (tableId: string) => void;
  onPositionChange?: (tableId: string, x: number, y: number) => void;
}

export const TableCard: React.FC<TableCardProps> = ({
  table,
  guests,
  isSelected,
  onSelect,
  onPositionChange,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: table.x, y: table.y })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Add a slight scale animation when grabbing
        Animated.spring(scale, {
          toValue: 1.05,
          useNativeDriver: true,
        }).start();
        // Set the offset to current position
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        // Flatten the offset and reset scale
        pan.flattenOffset();
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        // Calculate new position
        const newX = Math.max(0, (pan.x as any)._value);
        const newY = Math.max(0, (pan.y as any)._value);

        // Notify parent of position change
        if (onPositionChange) {
          onPositionChange(table.id, newX, newY);
        }
      },
    })
  ).current;

  const seatedCount = getSeatedCount(table);
  const occupancyPercent = (seatedCount / table.capacity) * 100;

  const getOccupancyColor = () => {
    if (occupancyPercent === 100) return "#10B981"; // green
    if (occupancyPercent >= 70) return "#F59E0B"; // amber
    return "#6B7280"; // gray
  };

  const getOccupancyText = () => {
    if (seatedCount === table.capacity) return "FULL";
    return `${seatedCount} / ${table.capacity}`;
  };

  const guestMap = new Map(guests.map((g) => [g.id, g]));

  // Render rectangle table seats (top and bottom rows)
  const renderRectangleSeats = () => {
    const topSeats = table.seats.slice(0, 4);
    const bottomSeats = table.seats.slice(4, 8);

    return (
      <>
        {/* Top row */}
        <View style={styles.rectangleSeatRow}>
          {topSeats.map((seat, i) => {
            const guest = guestMap.get(seat.guestId || "") || null;
            return (
              <View
                key={`top-${i}`}
                style={[
                  styles.rectangleSeatBox,
                  guest ? styles.seatFilled : styles.seatEmpty,
                ]}
              >
                <Text style={styles.seatLabel} numberOfLines={1}>
                  {guest ? guest.name.split(" ")[0] : i + 1}
                </Text>
              </View>
            );
          })}
        </View>
        {/* Table name in middle */}
        <View style={styles.tableNameContainer}>
          <Text style={styles.tableName}>{table.name}</Text>
        </View>
        {/* Bottom row */}
        <View style={styles.rectangleSeatRow}>
          {bottomSeats.map((seat, i) => {
            const guest = guestMap.get(seat.guestId || "") || null;
            return (
              <View
                key={`bottom-${i}`}
                style={[
                  styles.rectangleSeatBox,
                  guest ? styles.seatFilled : styles.seatEmpty,
                ]}
              >
                <Text style={styles.seatLabel} numberOfLines={1}>
                  {guest ? guest.name.split(" ")[0] : i + 5}
                </Text>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  // Render circle table seats (around the circle)
  const renderCircleSeats = () => {
    return (
      <>
        {/* Table name in center */}
        <View style={styles.circleNameContainer}>
          <Text style={styles.tableName}>{table.name}</Text>
          <Text style={styles.occupancyText}>{getOccupancyText()}</Text>
        </View>
        {/* Seats around the circle */}
        <View style={styles.circleSeatsContainer}>
          {table.seats.map((seat, i) => {
            const guest = guestMap.get(seat.guestId || "") || null;
            const angle = (i * 360) / table.capacity;
            const radius = 45;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <View
                key={i}
                style={[
                  styles.circleSeat,
                  guest ? styles.seatFilled : styles.seatEmpty,
                  {
                    transform: [{ translateX: x }, { translateY: y }],
                  },
                ]}
              >
                <Text style={styles.circleSeatText}>
                  {guest ? guest.name.charAt(0) : i + 1}
                </Text>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.tableCardWrapper,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.tableCard,
          table.type === "circle" && styles.tableCardCircle,
          isSelected && styles.tableCardSelected,
        ]}
        onPress={() => onSelect(table.id)}
        activeOpacity={0.9}
      >
        {table.type === "rectangle"
          ? renderRectangleSeats()
          : renderCircleSeats()}

        {/* Occupancy indicator */}
        <View
          style={[
            styles.occupancyBadge,
            { backgroundColor: getOccupancyColor() },
          ]}
        >
          <Text style={styles.occupancyBadgeText}>{getOccupancyText()}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tableCardWrapper: {
    position: "absolute",
  },
  tableCard: {
    position: "absolute",
    width: 140,
    minHeight: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  tableCardCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  tableCardSelected: {
    borderColor: "#EE2B8C",
    shadowColor: "#EE2B8C",
    shadowOpacity: 0.3,
  },
  // Rectangle table styles
  rectangleSeatRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  rectangleSeatBox: {
    width: 26,
    height: 18,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  seatEmpty: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  seatFilled: {
    backgroundColor: "#FDF2F8",
    borderWidth: 1,
    borderColor: "#F472B6",
  },
  seatLabel: {
    fontSize: 7,
    fontWeight: "600",
    color: "#374151",
  },
  tableNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tableName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  // Circle table styles
  circleNameContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -10 }],
    alignItems: "center",
    width: 60,
  },
  circleSeatsContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  circleSeat: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  circleSeatText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#374151",
  },
  // Occupancy badge
  occupancyBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  occupancyBadgeText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  occupancyText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },
});
