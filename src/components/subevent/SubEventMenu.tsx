import { SubEvent } from "@/src/constants/event";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type SubEventMenuProps = {
  item: SubEvent | null;
  visible: boolean;
  onClose: () => void;
  onDuplicate: (item: SubEvent) => void;
  duplicatingId: string | null;
};

export default function SubEventMenu({
  item,
  visible,
  onClose,
  onDuplicate,
  duplicatingId,
}: SubEventMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/20 justify-end"
        onPress={onClose}
      >
        <Pressable className="bg-white rounded-2xl p-4 mx-4 mb-6">
          <TouchableOpacity
            onPress={() => item && onDuplicate(item)}
            disabled={duplicatingId === item?.id}
            className="flex-row items-center gap-3 py-3"
          >
            <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
              <Ionicons name="copy-outline" size={16} color="#ee2b8c" />
            </View>
            <Text className="text-base text-gray-900">
              {duplicatingId === item?.id ? "Duplicating..." : "Duplicate"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            className="flex-row items-center gap-3 py-3"
          >
            <View className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="close" size={16} color="#9CA3AF" />
            </View>
            <Text className="text-base text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}