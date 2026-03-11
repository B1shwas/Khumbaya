import { Text } from "@/src/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

export type FamilyOptionsMenuProps = {
  visible: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function FamilyOptionsMenu({
  visible,
  isDeleting,
  onClose,
  onEdit,
  onDelete,
}: FamilyOptionsMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1" onPress={onClose} />

      <View className="rounded-t-3xl border-t border-gray-100 bg-white shadow-lg">
        {/* Handle Bar */}
        <View className="items-center py-3">
          <View className="h-1 w-12 rounded-full bg-gray-300" />
        </View>

        {/* Header */}
        <View className="border-b border-gray-100 px-6 pb-4 pt-2">
          <Text className="text-lg font-jakarta-bold text-gray-900">
            Family Options
          </Text>
        </View>

        {/* Menu Items */}
        <View className="px-6">
          {/* Edit Option */}
          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={onEdit}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Ionicons name="create-outline" size={20} color="#2563eb" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-jakarta-semibold text-gray-900">
                Edit Family
              </Text>
              <Text className="text-xs text-gray-500">Change family name</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>

          {/* Divider */}
          <View className="h-px bg-gray-100" />

          {/* Delete Option */}
          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={onDelete}
            disabled={isDeleting}
            activeOpacity={isDeleting ? 0.5 : 0.7}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-jakarta-semibold text-red-600">
                {isDeleting ? "Deleting..." : "Delete Family"}
              </Text>
              <Text className="text-xs text-red-500">
                Remove family permanently
              </Text>
            </View>
            {!isDeleting && (
              <Ionicons name="chevron-forward" size={18} color="#fecaca" />
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </View>
    </Modal>
  );
}
