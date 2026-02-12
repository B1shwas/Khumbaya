// GuestCard Component
// ============================================

import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { Guest } from "../types";
import { getSourceInfo, getStatusBgColor } from "../utils";

interface GuestCardProps {
  guest: Guest;
  onPress: () => void;
  onSendInvite: () => void;
}

const GuestCard = ({ guest, onPress, onSendInvite }: GuestCardProps) => {
  const sourceInfo = getSourceInfo(guest.source);
  const statusBgColor = getStatusBgColor(guest.status);

  return (
    <TouchableOpacity
      className="relative flex-row items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm border border-gray-100 active:opacity-80 mb-2"
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`${guest.name}, ${guest.status}`}
      accessibilityRole="button"
    >
      {/* Left Line Indicator */}
      <View
        className="absolute left-0 top-2 bottom-2 w-1 rounded-l-xl"
        style={{ backgroundColor: statusBgColor }}
      />

      <View className="flex-row items-center gap-3 flex-1 min-w-0 pl-3">
        {guest.avatar ? (
          <Image
            source={{ uri: guest.avatar }}
            className="h-12 w-12 shrink-0 rounded-full"
            resizeMode="cover"
            alt={`${guest.name}'s avatar`}
          />
        ) : (
          <View className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 items-center justify-center">
            <Text className="text-orange-600 font-bold text-lg">
              {guest.initials}
            </Text>
          </View>
        )}
        <View className="flex-col justify-center flex-1 min-w-0">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text
              className="text-sm font-bold text-gray-900 truncate"
              accessibilityLabel={`Guest name: ${guest.name}`}
            >
              {guest.name}
            </Text>
            {guest.hasPlusOne && (
              <Text
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
                accessibilityLabel="Has plus one"
              >
                +1
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-2 mt-0.5">
            {guest.relation && (
              <Text
                className="text-xs text-gray-500"
                accessibilityLabel={`Relation: ${guest.relation}`}
              >
                {guest.relation}
              </Text>
            )}
            {guest.phone && (
              <Text
                className="text-xs text-gray-400"
                accessibilityLabel={`Phone: ${guest.phone}`}
              >
                {guest.phone}
              </Text>
            )}
          </View>
          {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 ? (
            <View className="flex-row items-center gap-1 flex-wrap mt-1">
              {guest.dietaryRestrictions.map((restriction, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50"
                  accessibilityLabel={`Dietary restriction: ${restriction}`}
                >
                  <Ionicons name="leaf-outline" size={10} color="#6B7280" />
                  <Text className="text-[10px] text-gray-500">
                    {restriction}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View className="shrink-0 flex-col items-end gap-1">
        <View
          className={`h-7 w-7 rounded-full items-center justify-center`}
          style={{ backgroundColor: statusBgColor }}
          accessibilityLabel={`Status: ${guest.status}`}
        >
          <Ionicons
            name={
              guest.status === "Going"
                ? "checkmark"
                : guest.status === "Not Going"
                  ? "close"
                  : guest.status === "Not Invited"
                    ? "mail-outline"
                    : "time"
            }
            size={16}
            color={
              guest.status === "Going"
                ? "#16A34A"
                : guest.status === "Not Going"
                  ? "#DC2626"
                  : guest.status === "Not Invited"
                    ? "#9CA3AF"
                    : "#EA580C"
            }
            accessible={true}
            accessibilityLabel={`${guest.status} icon`}
          />
        </View>

        {/* Quick Action Buttons */}
        {guest.status === "Not Invited" && (
          <TouchableOpacity
            className="flex-row items-center gap-1 px-2 py-1 rounded-full bg-primary/10"
            onPress={onSendInvite}
            accessibilityLabel="Send invite"
            accessibilityRole="button"
          >
            <Ionicons name="send" size={12} color="#ee2b8c" />
            <Text className="text-[10px] font-medium text-primary">Invite</Text>
          </TouchableOpacity>
        )}

        {/* Source indicator */}
        <View
          className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-50"
          accessibilityLabel={`Source: ${sourceInfo.label}`}
        >
          <Ionicons
            name={sourceInfo.icon as any}
            size={10}
            color={sourceInfo.color}
            accessible={true}
            accessibilityLabel={`${sourceInfo.label} icon`}
          />
          <Text className="text-[10px] font-medium text-gray-400">
            {sourceInfo.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GuestCard;
