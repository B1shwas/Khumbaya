import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import type { Guest } from "../../../types/subevent";

interface GuestManagementModalProps {
  visible: boolean;
  guests: Guest[];
  onClose: () => void;
  onToggleGuest: (guestId: string) => void;
  onDeleteGuest: (guestId: string) => void;
  onAddManually: () => void;
  onUploadExcel: () => void;
}

export const GuestManagementModal: React.FC<GuestManagementModalProps> = ({
  visible,
  guests,
  onClose,
  onToggleGuest,
  onDeleteGuest,
  onAddManually,
  onUploadExcel,
}) => {
  const renderGuestItem = ({ item }: { item: Guest }) => (
    <View
      style={[
        localStyles.guestItem,
        item.invited && localStyles.guestItemInvited,
      ]}
    >
      <TouchableOpacity
        style={localStyles.guestToggle}
        onPress={() => onToggleGuest(item.id)}
      >
        <View
          style={[
            localStyles.inviteCheckbox,
            item.invited && localStyles.inviteCheckboxSelected,
          ]}
        >
          {item.invited && (
            <Ionicons name="checkmark" size={14} color="white" />
          )}
        </View>
        <Text
          style={[
            localStyles.guestName,
            item.invited && localStyles.guestNameInvited,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>

      <Text style={localStyles.guestRelation} numberOfLines={1}>
        {item.relation}
      </Text>

      <TouchableOpacity
        onPress={() => onDeleteGuest(item.id)}
        style={localStyles.deleteButton}
      >
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

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
            <Text style={localStyles.modalTitle}>Manage Guests</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#181114" />
            </TouchableOpacity>
          </View>

          <View style={localStyles.modalActions}>
            <TouchableOpacity
              style={localStyles.modalActionButton}
              onPress={onAddManually}
            >
              <Ionicons name="person-add" size={20} color="#ee2b8c" />
              <Text style={localStyles.modalActionText}>Add Manually</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.modalActionButton}
              onPress={onUploadExcel}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#10B981"
              />
              <Text style={localStyles.modalActionText}>Upload Excel</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={guests}
            keyExtractor={(item) => item.id}
            renderItem={renderGuestItem}
            style={localStyles.guestList}
          />
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
    paddingBottom: 32,
    maxHeight: "85%",
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
  modalActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  modalActionText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#181114",
  },
  guestList: {
    paddingHorizontal: 16,
  },
  guestItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  guestItemInvited: {
    backgroundColor: "#f0fdf4",
  },
  guestToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inviteCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  inviteCheckboxSelected: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  guestName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  guestNameInvited: {
    color: "#10B981",
  },
  guestRelation: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginRight: 12,
    maxWidth: 80,
  },
  deleteButton: {
    padding: 4,
  },
});
