// AddGuestModal Component
// ============================================

import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ALL_RELATIONS } from "../constants";
import type { AddGuestFormData } from "../types";

interface AddGuestModalProps {
  visible: boolean;
  formData: AddGuestFormData;
  onFormChange: (data: Partial<AddGuestFormData>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const AddGuestModal = ({
  visible,
  formData,
  onFormChange,
  onSubmit,
  onClose,
}: AddGuestModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[85%]">
          <View className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Add New Guest
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2"
              accessibilityLabel="Close modal"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Guest Name *
              </Text>
              <TextInput
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                placeholder="Enter guest name"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(text) => onFormChange({ name: text })}
                accessibilityLabel="Guest name input"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(text) => onFormChange({ email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email input"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </Text>
              <TextInput
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(text) => onFormChange({ phone: text })}
                keyboardType="phone-pad"
                accessibilityLabel="Phone number input"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Relationship
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {ALL_RELATIONS.map((relation) => (
                  <TouchableOpacity
                    key={relation}
                    className={`px-3 py-1.5 rounded-full border ${
                      formData.relation === relation
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-200"
                    }`}
                    onPress={() => onFormChange({ relation })}
                    accessibilityLabel={`${relation} relation`}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: formData.relation === relation,
                    }}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        formData.relation === relation
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {relation}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              className={`w-full py-4 rounded-xl items-center ${
                formData.name.trim() ? "bg-primary" : "bg-gray-300"
              }`}
              onPress={onSubmit}
              disabled={!formData.name.trim()}
              accessibilityLabel="Add guest button"
              accessibilityRole="button"
              accessibilityState={{ disabled: !formData.name.trim() }}
            >
              <Text className="text-white font-bold text-base">Add Guest</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddGuestModal;
