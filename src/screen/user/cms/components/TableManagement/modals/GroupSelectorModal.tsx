import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GuestGroup } from "../../../types/tableManagement";
import { styles } from "../../styles/TableManagement.styles";

interface GroupSelectorModalProps {
  visible: boolean;
  groups: GuestGroup[];
  selectedTableCapacity: number;
  onSelectGroup: (group: GuestGroup) => void;
  onClose: () => void;
}

export const GroupSelectorModal: React.FC<GroupSelectorModalProps> = ({
  visible,
  groups,
  selectedTableCapacity,
  onSelectGroup,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Group</Text>
          <Text style={styles.modalSubtitle}>
            Tap a group to assign all members to this table
          </Text>

          <ScrollView style={styles.groupList}>
            {groups.map((group) => {
              const groupMembers = group.members.filter((m) => !m.assigned);
              const totalNeeded = groupMembers.reduce(
                (sum, m) => sum + m.familySize,
                0,
              );
              const availableSeats = selectedTableCapacity;
              const canAssign = availableSeats >= totalNeeded;

              return (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupOption,
                    !canAssign && styles.groupOptionDisabled,
                  ]}
                  onPress={() => canAssign && onSelectGroup(group)}
                  disabled={!canAssign}
                >
                  <View style={styles.groupOptionInfo}>
                    <Text style={styles.groupOptionName}>{group.name}</Text>
                    <Text style={styles.groupOptionMembers}>
                      {groupMembers.map((m) => m.name).join(", ")}
                    </Text>
                    <Text style={styles.groupOptionSize}>
                      Seats needed: {totalNeeded}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.groupOptionCheck,
                      canAssign && styles.groupOptionCheckActive,
                    ]}
                  >
                    <Ionicons
                      name={canAssign ? "checkmark" : "close"}
                      size={18}
                      color={canAssign ? "white" : "#9CA3AF"}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
