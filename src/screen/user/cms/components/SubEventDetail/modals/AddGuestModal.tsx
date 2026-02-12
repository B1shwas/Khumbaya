import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { RELATIONS } from "../../../types/subevent";

interface AddGuestModalProps {
  visible: boolean;
  name: string;
  phone: string;
  email: string;
  relation: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRelationChange: (value: string) => void;
  onClose: () => void;
  onAdd: () => void;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  visible,
  name,
  phone,
  email,
  relation,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onRelationChange,
  onClose,
  onAdd,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={localStyles.modalOverlay}>
        <View style={localStyles.modalContent}>
          <View style={localStyles.modalHeader}>
            <Text style={localStyles.modalTitle}>Add Guest</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#181114" />
            </TouchableOpacity>
          </View>

          <ScrollView style={localStyles.formContainer}>
            <TextInput
              style={localStyles.formInput}
              placeholder="Guest Name *"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={onNameChange}
            />

            <TextInput
              style={localStyles.formInput}
              placeholder="Phone Number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={onPhoneChange}
              keyboardType="phone-pad"
            />

            <TextInput
              style={localStyles.formInput}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
            />

            <Text style={localStyles.label}>Relationship</Text>
            <View style={localStyles.relationContainer}>
              {RELATIONS.map((rel) => (
                <TouchableOpacity
                  key={rel}
                  style={[
                    localStyles.relationChip,
                    relation === rel && localStyles.relationChipSelected,
                  ]}
                  onPress={() => onRelationChange(rel)}
                >
                  <Text
                    style={[
                      localStyles.relationChipText,
                      relation === rel && { color: "white" },
                    ]}
                  >
                    {rel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={localStyles.addButton} onPress={onAdd}>
              <Text style={localStyles.addButtonText}>Add Guest</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  formContainer: {
    padding: 16,
  },
  formInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  label: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
    marginBottom: 8,
  },
  relationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  relationChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  relationChipSelected: {
    backgroundColor: "#ee2b8c",
    borderColor: "#ee2b8c",
  },
  relationChipText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#6B7280",
  },
  addButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
});
