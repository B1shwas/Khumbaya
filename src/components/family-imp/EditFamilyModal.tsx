import { Text } from "@/src/components/ui/Text";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";

export type EditFamilyModalProps = {
  visible: boolean;
  value: string;
  isUpdating: boolean;
  onClose: () => void;
  onChangeText: (value: string) => void;
  onSave: () => void;
};

export default function EditFamilyModal({
  visible,
  value,
  isUpdating,
  onClose,
  onChangeText,
  onSave,
}: EditFamilyModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30 items-center justify-center px-6">
        <View className="w-full max-w-md bg-white rounded-2xl p-5">
          <Text className="text-lg font-jakarta-bold text-gray-900 mb-1">
            Edit Family
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Update your family name.
          </Text>

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Enter family name"
            placeholderTextColor="#9CA3AF"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
            editable={!isUpdating}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={onSave}
          />

          <View className="mt-5 flex-row justify-end">
            <TouchableOpacity
              className="px-4 py-2 mr-2"
              onPress={onClose}
              disabled={isUpdating}
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-primary"
              onPress={onSave}
              disabled={isUpdating}
            >
              <Text className="text-white font-jakarta-semibold">
                {isUpdating ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
