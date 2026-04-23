import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      className={`bg-white rounded-2xl p-4 flex-row items-center mb-3 border-2 shadow-sm ${
        isSelected ? "border-emerald-500 bg-emerald-50" : "border-transparent"
      } ${isFull ? "opacity-60" : ""}`}
      onPress={() => onSelect(room.id)}
      activeOpacity={0.8}
    >
      <View className="w-14 h-14 rounded-xl bg-pink-100 items-center justify-center mr-3">
        <Ionicons
          name={getRoomTypeIcon(room.type) as any}
          size={32}
          color={isFull ? "#9CA3AF" : "#ee2b8c"}
        />
      </View>

      <View className="flex-1">
        <Text
          className={`text-base font-bold mb-0.5 ${
            isFull ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {room.name}
        </Text>
        <Text
          className={`text-xs mb-2 ${isFull ? "text-gray-400" : "text-gray-500"}`}
        >
          {room.type.charAt(0).toUpperCase() + room.type.slice(1)} • Up to{" "}
          {room.capacity} guests
        </Text>

        <View className="flex-row flex-wrap gap-1 mb-2">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} className="bg-gray-100 px-2 py-0.5 rounded">
              <Text className="text-[10px] text-gray-500">{amenity}</Text>
            </View>
          ))}
          {room.amenities.length > 3 && (
            <Text className="text-[10px] text-gray-400 self-center">
              +{room.amenities.length - 3}
            </Text>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1">
            <View className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${occupancyPercent}%`,
                  backgroundColor: getOccupancyColor(),
                }}
              />
            </View>
            <Text
              className="text-xs font-semibold min-w-[45px] text-right"
              style={{ color: getOccupancyColor() }}
            >
              {room.available} / {room.capacity}
            </Text>
          </View>

          <Text className="text-base font-bold text-primary ml-2">
            ${room.pricePerNight}
            <Text className="text-xs font-normal text-gray-400">/night</Text>
          </Text>
        </View>

        {assignedGuests.length > 0 && (
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="text-xs font-semibold text-gray-500 mb-2">
              {onAssignMember ? "Assigned Members:" : "Assigned Guests:"}
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {assignedGuests.map((guestId) => (
                <View
                  key={guestId}
                  className="flex-row items-center gap-1 bg-pink-100 px-2.5 py-1 rounded-xl"
                >
                  <Text className="text-xs text-pink-900">
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

        {(onAssignGuest || onAssignMember) && !isFull && (
          <TouchableOpacity
            className="flex-row items-center justify-center gap-1.5 mt-3 py-2 rounded-lg border border-dashed border-primary"
            onPress={() => {
              if (onAssignMember) {
                onAssignMember(room.id);
              } else if (onAssignGuest) {
                onAssignGuest(room.id);
              }
            }}
          >
            <Ionicons name="person-add" size={16} color="#ee2b8c" />
            <Text className="text-xs font-semibold text-primary">
              {onAssignMember ? "Assign Member" : "Assign Guest"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="ml-2">
        {isFull ? (
          <View className="bg-red-100 px-2 py-1 rounded-md">
            <Text className="text-[10px] font-bold text-red-500">FULL</Text>
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
