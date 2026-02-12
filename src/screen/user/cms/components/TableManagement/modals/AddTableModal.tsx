import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { TABLE_TEMPLATES, TableTemplate } from "../../../types/tableManagement";
import { styles } from "../../styles/TableManagement.styles";

interface AddTableModalProps {
  visible: boolean;
  onSelectTemplate: (template: TableTemplate) => void;
  onClose: () => void;
}

export const AddTableModal: React.FC<AddTableModalProps> = ({
  visible,
  onSelectTemplate,
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
          <Text style={styles.modalTitle}>Add Table</Text>
          <View style={styles.tableOptions}>
            {TABLE_TEMPLATES.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tableOption}
                onPress={() => onSelectTemplate(template)}
              >
                <Ionicons
                  name={template.type === "rectangle" ? "square" : "ellipse"}
                  size={24}
                  color="#ee2b8c"
                />
                <Text style={styles.tableOptionName}>{template.name}</Text>
                <Text style={styles.tableOptionCapacity}>
                  {template.capacity} seats
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
