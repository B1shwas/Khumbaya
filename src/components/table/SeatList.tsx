import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
    <View className="flex-row flex-wrap gap-2 justify-center">
      {seats.map((seat, index) => {
        const guest = guestMap.get(seat.guestId || "") || null;
        const isFirstSeatOfGroup =
          guest && seats.findIndex((s) => s.guestId === guest.id) === index;

        return (
          <TouchableOpacity
            key={seat.id}
            className={`w-14 h-14 rounded-lg border items-center justify-center ${
              isFirstSeatOfGroup
                ? "border-violet-500 bg-violet-50"
                : guest
                ? "border-primary bg-pink-50"
                : "border-dashed border-gray-300 bg-gray-50"
            }`}
            onPress={() => onSeatPress?.(seat.id, guest)}
            disabled={!onSeatPress}
          >
            <View
              className={`w-7 h-7 rounded-full items-center justify-center ${
                isFirstSeatOfGroup
                  ? "bg-violet-500"
                  : guest
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  guest ? "text-white" : "text-gray-500"
                }`}
              >
                {guest ? guest.name.charAt(0) : index + 1}
              </Text>
            </View>
            {guest && (
              <Text
                className="text-[9px] text-gray-700 mt-0.5 max-w-[52px] text-center"
                numberOfLines={1}
              >
                {guest.name.split(" ")[0]}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
