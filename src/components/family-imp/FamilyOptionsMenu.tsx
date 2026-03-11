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
      <Pressable className="flex-1 bg-black/20" onPress={onClose}>
        <View className="absolute top-24 right-4 w-48 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
          <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={onEdit}
          >
            <Ionicons name="create-outline" size={18} color="#111827" />
            <Text className="ml-3 text-base text-gray-900">Edit Family</Text>
          </TouchableOpacity>

          <View className="h-px bg-gray-100" />

          <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={onDelete}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={18} color="#dc2626" />
            <Text className="ml-3 text-base text-red-600">
              {isDeleting ? "Deleting..." : "Delete Family"}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
