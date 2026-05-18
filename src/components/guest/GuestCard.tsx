import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Fragment, useState } from "react";
import { GuestDetailInterface } from "../../features/guests/types";

interface GuestCardProps {
  guest: GuestDetailInterface;
  onPress?: () => void;
  onDelete?: () => void;
  onDraftPress?: () => void;
  onMoveToDraft?: () => void;
  isMovingToDraft?: boolean;
  isDraftActionLoading?: boolean;
}

export default function GuestCard({
  guest,
  onPress,
  onDelete,
  onDraftPress,
  onMoveToDraft,
  isMovingToDraft = false,
  isDraftActionLoading = false,
}: GuestCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const displayStatus = (guest?.eventGuest?.status || "Pending").trim();
  const isDraft = displayStatus.toLowerCase() === "draft";

  const getStatusColor = () => {
    switch (displayStatus.toLowerCase()) {
      case "accepted":
      case "going":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "declined":
      case "not going":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusBgColor = () => {
    switch (displayStatus.toLowerCase()) {
      case "accepted":
      case "going":
        return "rgba(16, 185, 129, 0.1)";
      case "pending":
        return "rgba(245, 158, 11, 0.1)";
      case "declined":
      case "not going":
        return "rgba(239, 68, 68, 0.1)";
      default:
        return "rgba(107, 114, 128, 0.1)";
    }
  };

  const initials = guest.user.username
    ? guest.user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GU";

  const displayName =
    guest.user.username?.trim() || guest.user.email || "Guest";
  const relation = guest.user.relation?.trim();
  const phone = guest.user.phone?.trim();

return (
    <Fragment>
      <View className="mb-3 rounded-2xl bg-white">
        <Pressable
          onPress={onPress}
          disabled={!onPress}
          className="rounded-2xl"
        >
          <View className="min-h-[86px] flex-row items-center gap-3 px-4 py-3">
            {guest.user.photo ? (
              <Image
                source={{ uri: guest.user.photo }}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EE2B8C]">
                <Text className="text-base font-semibold text-white">
                  {initials}
                </Text>
              </View>
            )}

            <View className="flex-1">
              <Text
                numberOfLines={1}
                className="text-base font-semibold text-gray-900"
              >
                {displayName}
              </Text>

              {relation ? (
                <Text numberOfLines={1} className="mt-0.5 text-xs text-gray-500">
                  {relation}
                </Text>
              ) : null}

              {phone ? (
                <Text numberOfLines={1} className="mt-0.5 text-xs text-gray-500">
                  {phone}
                </Text>
              ) : null}
            </View>

            <View className="items-end justify-center gap-2">
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor: getStatusBgColor(),
                  maxWidth: 120,
                }}
              >
                <Text
                  numberOfLines={1}
                  className="text-xs font-semibold"
                  style={{ color: getStatusColor() }}
                >
                  {displayStatus}
                </Text>
              </View>

              {displayStatus.toLowerCase() === "pending" && onMoveToDraft ? (
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="ellipsis-horizontal" size={20} color="#F59E0B" />
                </TouchableOpacity>
              ) : null}

              {onDelete ? (
                <TouchableOpacity
                  onPress={onDelete}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Pressable>

        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
            className="flex-1 bg-black/30 justify-center items-center"
          >
            <View className="bg-white rounded-2xl p-4 w-4/5 max-w-xs">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Move to Draft
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                This will move the invitation back to draft status.
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setMenuVisible(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 items-center"
                >
                  <Text className="text-sm font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    onMoveToDraft?.();
                  }}
                  disabled={isMovingToDraft}
                  className="flex-1 py-2.5 rounded-xl bg-[#EE2B8C] items-center"
                >
                  {isMovingToDraft ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-sm font-semibold text-white">Move</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {isDraft && onDraftPress ? (
        <View className="px-4 pb-3">
          <Pressable
            onPress={onDraftPress}
            disabled={isDraftActionLoading}
   
            className="h-10 flex-row items-center justify-center rounded-xl border border-[#EE2B8C] bg-[#EE2B8C]/10"
          >
            {isDraftActionLoading ? (
              <ActivityIndicator size="small" color="#EE2B8C" />
            ) : (
              <>
                <Ionicons name="paper-plane-outline" size={16} color="#EE2B8C" />
                <Text className="ml-2 text-sm font-semibold text-[#EE2B8C]">
                  Send Invitation
                </Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}
    </Fragment>
  );
}
